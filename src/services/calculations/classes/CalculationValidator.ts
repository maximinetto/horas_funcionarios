import { Month } from "@prisma/client";
import { DateTime } from "luxon";

import Calculations from "collections/Calculations";
import Calculation from "entities/Calculation";
import Official from "entities/Official";
import InvalidValueError from "errors/InvalidValueError";
import { resetDateFromFirstDay } from "utils/date";
import { getNumberByMonth } from "utils/mapMonths";

export default class CalculationValidator {
  private year: number = 0;
  private official: Official = Official.default();
  private calculations: Calculations<Calculation> = new Calculations();

  constructor() {}

  async validate(
    {
      calculations,
      official,
      year,
    }: {
      calculations: Calculations<Calculation> | undefined;
      official: Official | undefined;
      year: number | undefined;
    },
    getAndTransformCalculations: () => Promise<Calculations<Calculation>>
  ): Promise<void> {
    this.entryPointIsValid({
      calculations,
      official,
      year,
    });

    if (Calculation.calculationsHasMoreLaterHours(this.calculations)) {
      this.checkCalculationsAreAfterDateOfEntry();
    }

    this.calculations = await getAndTransformCalculations();

    this.tryAllMonthsHaveHours();
  }

  checkCalculationsAreAfterDateOfEntry(): void {
    const { official, year } = this;
    const slowestCalculation = this.calculations.getSmallestCalculation();

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

  private entryPointIsValid({
    calculations,
    official,
    year,
  }: {
    calculations?: Calculations<Calculation>;
    year?: number;
    official?: Official;
  }) {
    if (!calculations || !(calculations instanceof Calculations)) {
      throw new Error("calculations must be an instance of Calculation");
    }

    this.officialIsDefined(official);

    if (!year) {
      throw new Error("year must be defined");
    }

    this.year = year;
    this.official = official;
    this.calculations = calculations;
  }

  public allMonthsHaveHours(): boolean {
    if (this.calculations.isEmpty()) {
      throw new Error("calculations must have at least one element");
    }

    const { dateOfEntry } = this.official;
    const dateOfEntryYear = dateOfEntry.year;
    const dateOfEntryMonth = dateOfEntry.month;
    const firstMonth =
      dateOfEntryYear === this.calculations.getSmallestCalculation().year
        ? dateOfEntryMonth
        : getNumberByMonth(Month.JANUARY);
    const lastMonthName = this.calculations.getBiggestCalculation().month;
    const lastMonthNumber = getNumberByMonth(lastMonthName);
    return this.calculations.every((calculation) => {
      const month = getNumberByMonth(calculation.month);
      const isBetween = month >= firstMonth && month <= lastMonthNumber;
      return isBetween;
    });
  }

  public officialIsDefined(official: Official | undefined): asserts official {
    if (!official) {
      throw new Error("official must be defined");
    }
  }

  public yearIsDefined(year: number | undefined): asserts year {
    if (!year) {
      throw new Error("official must be defined");
    }
  }

  private calculationIsAfterOfDateOfEntry(
    year: number,
    calculation: Calculation,
    dateOfEntry: DateTime
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
          year: dateOfEntry.year,
          month: dateOfEntry.month,
        })
      ).toMillis()
    );
  }

  private tryAllMonthsHaveHours() {
    this.officialIsDefined(this.official);

    if (!this.allMonthsHaveHours()) {
      throw new InvalidValueError("All months must have hours");
    }
  }
}
