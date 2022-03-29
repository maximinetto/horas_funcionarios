import { Month } from "@prisma/client";
import { DateTime } from "luxon";
import _xor from "lodash/xor";
import _differenceBy from "lodash/differenceBy";
import InvalidValueError from "errors/InvalidValueError";
import { resetDateFromFirstDay } from "utils/date";
import { getNumberByMonth } from "utils/mapMonths";

const idIsPresent = (calculation) => calculation.id != null;
export default class Calculate {
  constructor(calculationRepository) {
    this.calculationRepository = calculationRepository;
  }

  async validate() {
    const {
      calculations,
      year,
      official,
      calculationRepository,
      calculationIsAfterOfDateOfEntry,
      getSmallestCalculation,
      mergeCalculations,
      allMonthsHaveHours,
      selectOptions,
    } = this;

    if (!calculations || !Array.isArray(calculations)) {
      throw new Error("calculations must be an array");
    }

    const slowestCalculation = getSmallestCalculation(calculations);

    if (
      !calculationIsAfterOfDateOfEntry(
        year,
        slowestCalculation,
        official.dateOfEntry
      )
    ) {
      throw new InvalidValueError(
        "The year and month must be after or equal the date of entry"
      );
    }

    const calculationsFromPersistence = await calculationRepository.get(
      {
        officialId: official.id,
        year: year,
      },
      selectOptions
    );

    calculations = mergeCalculations(calculationsFromPersistence);

    if (!allMonthsHaveHours(calculations)) {
      throw new InvalidValueError("All months must have hours");
    }
  }

  async calculate({
    actualDate: _actualDate,
    calculations: _calculations,
    year: _year,
    official: _official,
  }) {
    const { validate, store } = this;
    store({
      calculations: _calculations,
      year: _year,
      official: _official,
      actualDate: _actualDate,
    });
    validate();
  }

  mergeCalculations(calculationsFromPersistence = []) {
    const { calculations } = this;
    const symmetricDifference = _xor(
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
          id,
          ...calculation,
        };
      }
    );

    return [
      ...symmetricDifference,
      ...differenceCalculationsFromPersistence,
    ].sort((a, b) => a.month - b.month);
  }

  calculationIsAfterOfDateOfEntry(year, calculation, dateOfEntry) {
    if (!calculation || !dateOfEntry) {
      throw new Error("calculation and dateOfEntry must be defined");
    }

    return (
      DateTime.fromObject(
        resetDateFromFirstDay({
          year,
          month: calculation.month,
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

  getSmallestCalculation(calculations) {
    const { sortLowestToHighest } = this;

    if (calculations.length === 0) {
      return null;
    }

    return calculations.sort(sortLowestToHighest)[0];
  }

  getBiggestCalculation = (calculations) => {
    const { sortLowestToHighest } = this;
    if (calculations.length === 0) {
      return null;
    }

    return calculations.sort((a, b) => sortLowestToHighest(a, b) * -1)[
      calculations.length - 1
    ];
  };

  allMonthsHaveHours(calculations) {
    const { getBiggestCalculation } = this;
    const firstMonth = getNumberByMonth(Month.JANUARY);
    const lastMonth = getBiggestCalculation(calculations).month;

    return calculations.every((calculation) => {
      const month = getNumberByMonth(calculation.month);
      return month >= firstMonth && month <= lastMonth;
    });
  }

  sortLowestToHighest = (a, b) => {
    return (
      DateTime.fromObject(
        resetDateFromFirstDay({ year: a.year, month: a.month })
      ).toMillis() -
      DateTime.fromObject(
        resetDateFromFirstDay({ year: b.year, month: b.month })
      ).toMillis()
    );
  };

  calculationsWithId = (calculations = []) => calculations.filter(idIsPresent);

  calculationsWithoutId = (calculations = []) =>
    calculations.filter((calculation) => !idIsPresent(calculation));

  store({ calculations, year, official, actualDate }) {
    this.calculations = calculations;
    this.actualDate = actualDate;
    this.year = year;
    this.official = official;

    return {
      calculations,
      year,
      official,
      actualDate,
      selectOptions: this.selectOptions,
    };
  }
}
