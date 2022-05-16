import {
  CalculationParam,
  PrismaCalculationFinderOptions,
} from "@/@types/calculations";
import Calculation from "@/entities/Calculation";
import InvalidValueError from "@/errors/InvalidValueError";
import type { CalculationRepository } from "@/persistence/calculations";
import { resetDateFromFirstDay } from "@/utils/date";
import { getNumberByMonth } from "@/utils/mapMonths";
import { HourlyBalance, Month, Official } from "@prisma/client";
import _cloneDeep from "lodash/cloneDeep";
import _differenceBy from "lodash/differenceBy";
import _xorBy from "lodash/xorBy";
import { DateTime } from "luxon";

const idIsPresent = (calculation: Calculation): boolean =>
  calculation.id != null;
export default abstract class Calculator {
  protected calculationRepository: CalculationRepository;
  protected calculationsFromPersistence: Calculation[];
  protected calculations: Calculation[];
  protected year?: number;
  protected official?: Official;
  protected hourlyBalances: HourlyBalance[];

  constructor(calculationRepository: CalculationRepository) {
    this.calculationRepository = calculationRepository;
    this.calculations = [];
    this.calculationsFromPersistence = [];
    this.hourlyBalances = [];
    this.sortLowestToHighest.bind(this);
    this.getBiggestCalculation.bind(this);
  }

  protected abstract selectOptions(): PrismaCalculationFinderOptions;
  protected abstract replaceCalculationId(
    calculation: Calculation,
    id: string
  ): Calculation;

  async validate() {
    if (!this.calculations || !Array.isArray(this.calculations)) {
      throw new Error("calculations must be an array");
    }

    if (!this.official) {
      throw new Error("official must be defined");
    }

    if (!this.year) {
      throw new Error("year must be defined");
    }

    if (this.calculations.length > 0) {
      const slowestCalculation = this.getSmallestCalculation(this.calculations);

      if (
        !this.calculationIsAfterOfDateOfEntry(
          this.year,
          slowestCalculation,
          this.official.dateOfEntry
        )
      ) {
        throw new InvalidValueError(
          "The year and month must be after or equal the date of entry"
        );
      }
    }

    if (this.calculationsFromPersistence.length === 0) {
      this.calculationsFromPersistence = await this.calculationRepository.get(
        {
          actualBalance: {
            officialId: this.official.id,
          },
          year: this.year,
        },
        this.selectOptions()
      );
    }

    this.calculations = this.mergeCalculations(
      this.calculationsFromPersistence
    );

    if (!this.allMonthsHaveHours(this.calculations)) {
      throw new InvalidValueError("All months must have hours");
    }
  }

  async calculate({
    calculations: _calculations,
    calculationsFromPersistence = [],
    year: _year,
    official: _official,
    hourlyBalances: _hourlyBalances,
  }: CalculationParam): Promise<void | any> {
    this.store({
      calculations: _calculations,
      year: _year,
      official: _official,
      hourlyBalances: _hourlyBalances,
      calculationsFromPersistence,
    });

    return this.validate();
  }

  mergeCalculations(calculationsFromPersistence: Calculation[]): Calculation[] {
    const symmetricDifference = _xorBy(
      this.calculations,
      calculationsFromPersistence,
      "month"
    );
    const differenceCalculations = _differenceBy(
      this.calculations,
      symmetricDifference,
      "month"
    );

    const differenceCalculationsFromPersistence: Calculation[] =
      differenceCalculations.map((calculation) => {
        const calculationFromPersistence = calculationsFromPersistence.find(
          (calculationFromPersistence) =>
            calculationFromPersistence.month === calculation.month
        );

        if (!calculationFromPersistence) {
          return calculation;
        }

        const { id } = calculationFromPersistence;
        return this.replaceCalculationId(calculation, id);
      });

    return [
      ...symmetricDifference,
      ...differenceCalculationsFromPersistence,
    ].sort(this.sortLowestToHighest);
  }

  calculationIsAfterOfDateOfEntry(
    year: number,
    calculation: Calculation,
    dateOfEntry: Date
  ) {
    const monthNumber = Number(calculation.month);
    const month = isNaN(monthNumber)
      ? getNumberByMonth(calculation.month)
      : monthNumber;

    return (
      DateTime.fromObject(
        resetDateFromFirstDay({
          year,
          month,
        })
      ).toMillis() >=
      DateTime.fromObject(
        resetDateFromFirstDay({
          year: dateOfEntry.getFullYear(),
          month: dateOfEntry.getMonth() + 1,
        })
      ).toMillis()
    );
  }

  getSmallestCalculation(calculations: Calculation[]): Calculation {
    if (calculations.length === 0) {
      throw new Error("calculations must be not empty");
    }

    return _cloneDeep(calculations).sort(this.sortLowestToHighest)[0];
  }

  getBiggestCalculation = (calculations: Calculation[]): Calculation => {
    if (calculations.length === 0) {
      throw new Error("calculations must be not empty");
    }

    return calculations
      .slice()
      .sort((a, b) => this.sortLowestToHighest(a, b) * -1)[0];
  };

  allMonthsHaveHours(calculations: Calculation[]): boolean {
    if (calculations.length === 0) {
      throw new Error("calculations must have at least one element");
    }

    if (!this.official) {
      throw new Error("official must be defined");
    }

    const { dateOfEntry } = this.official;
    const dateOfEntryYear = dateOfEntry.getFullYear();
    const dateOfEntryMonth = dateOfEntry.getMonth() + 1;
    const firstMonth =
      dateOfEntryYear === calculations[0].year
        ? dateOfEntryMonth
        : getNumberByMonth(Month.JANUARY);
    const lastMonthName = this.getBiggestCalculation(calculations).month;
    const lastMonthNumber = getNumberByMonth(lastMonthName);
    return calculations.every((calculation) => {
      const month = getNumberByMonth(calculation.month);
      const isBetween = month >= firstMonth && month <= lastMonthNumber;
      return isBetween;
    });
  }

  sortLowestToHighest(a: Calculation, b: Calculation) {
    const monthA = getNumberByMonth(a.month);
    const monthB = getNumberByMonth(b.month);

    return (
      DateTime.fromObject(
        resetDateFromFirstDay({ year: a.year, month: monthA })
      ).toMillis() -
      DateTime.fromObject(
        resetDateFromFirstDay({ year: b.year, month: monthB })
      ).toMillis()
    );
  }

  calculationsWithId(calculations: Calculation[]) {
    return calculations.filter(idIsPresent);
  }

  calculationsWithoutId(calculations: Calculation[]) {
    return calculations.filter((calculation) => !idIsPresent(calculation));
  }

  store({
    calculations,
    year,
    official,
    hourlyBalances,
    calculationsFromPersistence,
  }: CalculationParam): CalculationParam {
    this.calculations = calculations;
    this.year = year;
    this.official = official;
    this.hourlyBalances = hourlyBalances;
    this.calculationsFromPersistence = calculationsFromPersistence ?? [];

    return {
      calculations,
      year,
      official,
      hourlyBalances,
      calculationsFromPersistence,
    };
  }
}
