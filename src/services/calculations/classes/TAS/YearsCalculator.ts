import {
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "@/@types/typeOfHours";
import { logger } from "@/config";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import { instance as Hours } from "@/services/calculations/classes/typeOfHours";
import { Decimal } from "decimal.js";

export default class YearsCalculator {
  private hourlyBalances: HourlyBalanceTAS[];
  private hoursActualYear: TypeOfHoursByYear;
  private totalDiscount: Decimal;
  private calculatedHours: TypeOfHoursByYear[];

  constructor() {
    this.hourlyBalances = [];
    this.hoursActualYear = {
      year: 0,
      hours: [],
    };
    this.totalDiscount = new Decimal(0);
    this.calculatedHours = [];
  }

  async calculate({
    hourlyBalances,
    hoursActualYear,
    totalDiscount,
  }: {
    hoursActualYear: TypeOfHoursByYear;
    hourlyBalances: HourlyBalanceTAS[];
    totalDiscount: Decimal;
  }): Promise<{
    calculatedHours: TypeOfHoursByYear[];
    calculatedHoursSanitized: TypeOfHoursByYearDecimal[];
  }> {
    const {
      calculatedHours,
      hoursActualYear: _hoursActualYear,
      hourlyBalances: _hourlyBalances,
    } = this.store({
      hourlyBalances: hourlyBalances,
      hoursActualYear: hoursActualYear,
      totalDiscount: totalDiscount,
    });

    for (const balance of _hourlyBalances) {
      const { year, simple, working, nonWorking } = balance;

      const typeOfHours = [
        {
          typeOfHour: TYPES_OF_HOURS.simple,
          value: new Decimal(simple.toString()),
        },
        {
          typeOfHour: TYPES_OF_HOURS.working,
          value: new Decimal(working.toString()),
        },
        {
          typeOfHour: TYPES_OF_HOURS.nonWorking,
          value: new Decimal(nonWorking.toString()),
        },
      ];
      await this.calculateTypesOfHours({
        year,
        hours: typeOfHours,
      });
    }

    await this.calculateTypesOfHours({
      year: _hoursActualYear.year,
      hours: _hoursActualYear.hours.map(({ typeOfHour, value }) => ({
        typeOfHour,
        value:
          typeof value === "bigint" ? new Decimal(value.toString()) : value,
      })),
    });

    return {
      calculatedHours: [...calculatedHours],
      calculatedHoursSanitized: this.calculatedHoursSanitized(),
    };
  }

  calculateTypesOfHours = ({
    year,
    hours,
  }: {
    year: number;
    hours: { typeOfHour: TYPES_OF_HOURS; value: Decimal }[];
  }) => {
    hours.forEach(({ typeOfHour, value }) => {
      const previousHours = this.getPreviousHours({
        currentYear: year,
        typeOfHour,
      });
      const sum = this.sumHours(value, previousHours);
      this.storeHours({ typeOfHour, year, value: sum });
    });
  };

  store = ({
    hourlyBalances: _hourlyBalances,
    hoursActualYear: _hoursActualYear,
    totalDiscount: _totalDiscount,
  }: {
    hourlyBalances: HourlyBalanceTAS[];
    hoursActualYear: TypeOfHoursByYear;
    totalDiscount: Decimal;
  }) => {
    this.hourlyBalances = [..._hourlyBalances];
    this.hoursActualYear = { ..._hoursActualYear };
    this.totalDiscount = _totalDiscount.greaterThan(0)
      ? _totalDiscount
      : new Decimal(0);
    this.calculatedHours = [];

    return {
      hourlyBalances: this.hourlyBalances,
      hoursActualYear: this.hoursActualYear,
      calculatedHours: this.calculatedHours,
      totalDiscount: this.totalDiscount,
    };
  };

  calculatedHoursSanitized = () => {
    return this.calculatedHours.map((calculatedHour) => {
      const { hours, ...others } = calculatedHour;
      const result = hours.map(({ typeOfHour, value }) => {
        const result =
          typeof value === "bigint" ? new Decimal(value.toString()) : value;
        return {
          typeOfHour,
          value: result.greaterThanOrEqualTo(0) ? result : new Decimal(0),
        };
      });
      return {
        ...others,
        hours: result,
      };
    });
  };

  sumHours = (hour: Decimal, accumulatedHours: Decimal | null): Decimal => {
    if (accumulatedHours == null) {
      return hour.sub(this.totalDiscount.toString());
    }
    return accumulatedHours.lessThan(0)
      ? accumulatedHours.add(hour.toString())
      : new Decimal(hour.toString());
  };

  getPreviousHours = ({
    currentYear,
    typeOfHour,
  }: {
    currentYear: number;
    typeOfHour: TYPES_OF_HOURS;
  }): Decimal | null => {
    if (this.calculatedHours.length === 0) {
      return null;
    }
    const yearToSearch = Hours.isFirstTypeOfHour(typeOfHour)
      ? currentYear - 1
      : currentYear;

    const yearSearched = this.calculatedHours.find(
      ({ year }) => year === yearToSearch
    );
    if (!yearSearched) {
      logger.info("year not found");
      logger.info("currentYear: ", { currentYear });
      logger.info("calculatedHours:", {
        calculatedHours: this.calculatedHours,
      });
      throw new Error("You must have a valid year");
    }

    const { hours: previousHours } = yearSearched;
    const previousHour = previousHours.find(
      ({ typeOfHour: _typeOfHour }) =>
        _typeOfHour === Hours.getPreviousTypeOfHour(typeOfHour)
    );
    if (!previousHour) {
      throw new Error("You must have a previous hour");
    }

    return new Decimal(previousHour.value.toString());
  };

  storeHours = ({
    typeOfHour,
    year,
    value,
  }: {
    typeOfHour: TYPES_OF_HOURS;
    year: number;
    value: Decimal;
  }): number | undefined => {
    if (Hours.isFirstTypeOfHour(typeOfHour)) {
      return this.calculatedHours.push({
        year,
        hours: [{ typeOfHour, value }],
      });
    }

    const yearSearched = this.calculatedHours.find(
      ({ year: _year }) => _year === year
    );
    if (!yearSearched) {
      throw new Error("You must have a valid year");
    }

    const { hours } = yearSearched;
    if (hours.length >= 3) {
      throw new Error(
        "You can't have more than 3 hours. Flaco algo hiciste mal"
      );
    }
    hours.push({ typeOfHour, value });
  };
}
