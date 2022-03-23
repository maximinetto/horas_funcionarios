import { Month } from "@prisma/client";
import { DateTime } from "luxon";
import _xor from "lodash/xor";
import _differenceBy from "lodash/differenceBy";
import InvalidValueError from "errors/InvalidValueError";
import { operations } from "persistence/calculations";
import { resetDateFromFirstDay } from "utils/date";
import { getNumberByMonth } from "utils/mapMonths";

const idIsPresent = (calculation) => calculation.id != null;
export default class Calculate {
  constructor({ actualDate, calculations, year, officialId }) {
    this.calculations = calculations;
    this.actualDate = actualDate;
    this.year = year;
    this.officialId = officialId;
  }

  async validate() {
    if (!this.calculations || !Array.isArray(this.calculations)) {
      throw new Error("calculations must be an array");
    }

    const slowestCalculation = this.getSmallestCalculation(this.calculations);

    if (
      !this.calculationIsAfterOfDateOfEntry(
        this.year,
        slowestCalculation,
        this.actualDate
      )
    ) {
      throw new InvalidValueError(
        "The year and month must be after or equal the date of entry"
      );
    }

    const calculationsFromPersistence = await operations.get(
      {
        officialId: this.officialId,
        year: this.year,
      },
      this.selectOptions
    );

    this.calculations = this.mergeCalculations(calculationsFromPersistence);

    if (!this.allMonthsHaveHours(this.calculations)) {
      throw new InvalidValueError("All months must have hours");
    }
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
    if (calculations.length === 0) {
      return null;
    }

    return calculations.sort(this.sortLowestToHighest);
  }

  getBiggestCalculation = (calculations) => {
    if (calculations.length === 0) {
      return null;
    }

    return calculations.sort((a, b) => this.sortLowestToHighest(a, b) * -1);
  };

  allMonthsHaveHours(calculations) {
    const firstMonth = getNumberByMonth(Month.JANUARY);
    const lastMonth = this.actualDate.getMonth() + 1;

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
}
