import {
  CalculationParam,
  PrismaCalculationFinderOptions,
} from "@/@types/calculations";
import InvalidValueError from "@/errors/InvalidValueError";
import type { CalculationRepository } from "@/persistence/calculations";
import { resetDateFromFirstDay } from "@/utils/date";
import { getMonthByNumber, getNumberByMonth } from "@/utils/mapMonths";
import { Calculation, HourlyBalance, Month, Official } from "@prisma/client";
import _cloneDeep from "lodash/cloneDeep";
import _differenceBy from "lodash/differenceBy";
import _xorBy from "lodash/xorBy";
import { DateTime } from "luxon";

const idIsPresent = (calculation: Calculation): boolean =>
  calculation.id != null;
export default abstract class Calculate {
  protected calculationRepository: CalculationRepository;
  protected calculationsFromPersistence: Calculation[];
  protected calculations: Calculation[];
  protected year?: number;
  protected official?: Official;
  protected hourlyBalances: HourlyBalance[];

  constructor(calculationRepository: CalculationRepository) {
    this.calculationRepository = calculationRepository;
    this.calculate.bind(this);
    this.calculations = [];
    this.calculationsFromPersistence = [];
    this.hourlyBalances = [];
    this.calculate.bind(this);
    this.validate.bind(this);
    this.sortLowestToHighest.bind(this);
    this.getBiggestCalculation.bind(this);
  }

  protected abstract selectOptions(): PrismaCalculationFinderOptions;

  async validate() {
    const { calculations, year, official, calculationRepository } = this;

    if (!calculations || !Array.isArray(calculations)) {
      throw new Error("calculations must be an array");
    }

    if (!official) {
      throw new Error("official must be defined");
    }

    if (!year) {
      throw new Error("year must be defined");
    }

    if (calculations.length > 0) {
      const slowestCalculation = this.getSmallestCalculation(calculations);

      if (
        !this.calculationIsAfterOfDateOfEntry(
          year,
          slowestCalculation,
          official.dateOfEntry
        )
      ) {
        throw new InvalidValueError(
          "The year and month must be after or equal the date of entry"
        );
      }
    }

    if (this.calculationsFromPersistence.length === 0) {
      this.calculationsFromPersistence = await calculationRepository.get(
        {
          actualBalance: {
            officialId: official.id,
          },
          year: year,
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

  calculate({
    calculations: _calculations,
    calculationsFromPersistence,
    year: _year,
    official: _official,
    hourlyBalances: _hourlyBalances,
  }: CalculationParam): Promise<void | any> {
    return new Promise((resolve, reject) => {
      this.store({
        calculations: _calculations,
        year: _year,
        official: _official,
        hourlyBalances: _hourlyBalances,
        calculationsFromPersistence,
      });

      this.validate().then(resolve).catch(reject);
    });
  }

  mergeCalculations(calculationsFromPersistence: Calculation[]) {
    const { calculations } = this;
    const symmetricDifference = _xorBy(
      calculations,
      calculationsFromPersistence,
      "month"
    );
    const differenceCalculations = _differenceBy(
      calculations,
      symmetricDifference,
      "month"
    );

    const differenceCalculationsFromPersistence = differenceCalculations.map(
      (calculation) => {
        const calculationFromPersistence = calculationsFromPersistence.find(
          (calculationFromPersistence) =>
            calculationFromPersistence.month === calculation.month
        );

        if (!calculationFromPersistence) {
          return calculation;
        }

        const { id } = calculationFromPersistence;

        return {
          ...calculation,
          id,
        };
      }
    );

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
    this.calculations = this.calculationsWithMonthLikeString(calculations);
    this.year = year;
    this.official = official;
    this.hourlyBalances = hourlyBalances;
    this.calculationsFromPersistence = calculationsFromPersistence ?? [];

    return {
      calculations,
      year,
      official,
      hourlyBalances,
    };
  }

  calculationsWithMonthLikeString(calculations: Calculation[]) {
    return calculations.map((calculation) => ({
      ...calculation,
      month:
        typeof calculation.month === "number"
          ? getMonthByNumber(calculation.month)
          : calculation.month,
    }));
  }
}
