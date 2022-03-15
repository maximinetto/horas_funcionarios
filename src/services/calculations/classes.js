import { Month } from "@prisma/client";
import { DateTime } from "luxon";
import InvalidValueError from "errors/InvalidValueError";
import { operations } from "persistence/calculations";
import { resetDateFromFirstDay } from "utils/date";
import { getNumberByMonth } from "utils/mapMonths";

class Calculation {
  constructor({ actualDate, calculations, year, officialId }) {
    const idIsPresent = (calculation) => calculation.id != null;

    this.calculations = calculations;
    this.actualDate = actualDate;
    this.calculationsWithId = calculations.filter(idIsPresent);
    this.calculationsWithoutId = calculations.filter(
      (calculation) => !idIsPresent(calculation)
    );
    this.year = year;
    this.officialId = officialId;
    this.calculationsFromPersistence = [];
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

    this.calculationsFromPersistence = await operations.get(
      {
        officialId: this.officialId,
        year: this.year,
      },
      this.selectOptions
    );

    if (
      !this.allMonthsHaveHours({
        ...this.calculations,
        ...this.calculationsFromPersistence,
      })
    ) {
      throw new InvalidValueError("All months must have hours");
    }
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

    return calculations.sort((a, b) => {
      return (
        DateTime.fromObject(
          resetDateFromFirstDay({ year: a.year, month: a.month })
        ).toMillis() -
        DateTime.fromObject(
          resetDateFromFirstDay({ year: b.year, month: b.month })
        ).toMillis()
      );
    });
  }

  allMonthsHaveHours(calculations, actualDate) {
    const firstMonth = getNumberByMonth(Month.JANUARY);
    const lastMonth = actualDate.getMonth() + 1;

    return calculations.every((calculation) => {
      const month = getNumberByMonth(calculation.month);
      return month >= firstMonth && month <= lastMonth;
    });
  }
}

export class CalculateForTas extends Calculation {
  constructor({ actualDate, calculations, year, officialId }) {
    super({ actualDate, calculations, year, officialId });
  }

  async calculate() {
    await this.validate();
  }

  async withId(officialId, calculations) {}

  async withoutId(officialId, calculations) {}

  selectOptions() {
    return {
      include: {
        calculationTAS: true,
      },
    };
  }
}
