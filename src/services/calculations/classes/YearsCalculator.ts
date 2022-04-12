import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import {
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "@/@types/typeOfHours";
import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import { instance as Hours } from "@/services/calculations/classes/typeOfHours";
import Decimal from "decimal.js";

export default class YearsCalculator {
  private hourlyBalances: HourlyBalanceTAS[];
  private hoursActualYear: TypeOfHoursByYear;
  private totalDiscount: bigint;
  private calculatedHours: TypeOfHoursByYear[];

  constructor() {
    this.hourlyBalances = [];
    this.hoursActualYear = {
      year: 0,
      hours: [],
    };
    this.totalDiscount = 0n;
    this.calculatedHours = [];
  }

  calculate({
    hourlyBalances,
    hoursActualYear,
    totalDiscount,
  }: {
    hoursActualYear: TypeOfHoursByYear;
    hourlyBalances: HourlyBalanceTAS[];
    totalDiscount: bigint;
  }): Promise<{
    calculatedHours: TypeOfHoursByYear[];
    calculatedHoursSanitized: TypeOfHoursByYearDecimal[];
  }> {
    return new Promise((resolve, reject) => {
      const { store, calculateTypesOfHours, calculatedHoursSanitized } = this;

      const {
        calculatedHours,
        hoursActualYear: _hoursActualYear,
        hourlyBalances: _hourlyBalances,
      } = store({
        hourlyBalances: hourlyBalances,
        hoursActualYear: hoursActualYear,
        totalDiscount: totalDiscount,
      });

      for (const balance of _hourlyBalances) {
        const { hourlyBalanceTAS, year } = balance;
        if (!hourlyBalanceTAS) {
          return reject("hourlyBalanceTAS must be defined");
        }
        const { simple, working, nonWorking } = hourlyBalanceTAS;

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
        calculateTypesOfHours({
          year,
          hours: typeOfHours,
        });
      }

      calculateTypesOfHours({
        year: _hoursActualYear.year,
        hours: _hoursActualYear.hours.map(({ typeOfHour, value }) => ({
          typeOfHour,
          value:
            typeof value === "bigint" ? new Decimal(value.toString()) : value,
        })),
      });

      return resolve({
        calculatedHours: [...calculatedHours],
        calculatedHoursSanitized: calculatedHoursSanitized(),
      });
    });
  }

  calculateTypesOfHours = ({
    year,
    hours,
  }: {
    year: number;
    hours: { typeOfHour: TYPES_OF_HOURS; value: Decimal }[];
  }) => {
    const { sumHours, storeHours, getPreviousHours } = this;
    hours.forEach(({ typeOfHour, value }, index) => {
      const previousHours = getPreviousHours({
        currentYear: year,
        typeOfHour,
      });
      const sum = sumHours(value, previousHours);
      storeHours({ typeOfHour, year, value: sum });
    });
  };

  store = ({
    hourlyBalances: _hourlyBalances,
    hoursActualYear: _hoursActualYear,
    totalDiscount: _totalDiscount,
  }: {
    hourlyBalances: HourlyBalanceTAS[];
    hoursActualYear: TypeOfHoursByYear;
    totalDiscount: bigint;
  }) => {
    this.hourlyBalances = [..._hourlyBalances];
    this.hoursActualYear = { ..._hoursActualYear };
    this.totalDiscount = _totalDiscount > 0 ? _totalDiscount : 0n;

    return {
      hourlyBalances: this.hourlyBalances,
      hoursActualYear: this.hoursActualYear,
      calculatedHours: this.calculatedHours,
      totalDiscount: this.totalDiscount,
    };
  };

  calculatedHoursSanitized = () => {
    const { calculatedHours } = this;
    return calculatedHours.map((calculatedHour) => {
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
    const { calculatedHours } = this;
    if (calculatedHours.length === 0) {
      return null;
    }
    const yearToSearch = Hours.isFirstTypeOfHour(typeOfHour)
      ? currentYear - 1
      : currentYear;
    const yearSearched = calculatedHours.find(
      ({ year }) => year === yearToSearch
    );
    if (!yearSearched) {
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
    const { calculatedHours } = this;

    if (Hours.isFirstTypeOfHour(typeOfHour)) {
      return calculatedHours.push({
        year,
        hours: [{ typeOfHour, value }],
      });
    }

    const yearSearched = calculatedHours.find(
      ({ year: _year }) => _year === year
    );
    if (!yearSearched) {
      throw new Error("You must have a valid year");
    }

    const { hours } = yearSearched;
    hours.push({ typeOfHour, value });
  };
}
