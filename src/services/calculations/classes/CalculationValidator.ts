import Calculations from "@/collections/Calculations";
import Calculation from "@/entities/Calculation";
import Official from "@/entities/Official";
import InvalidValueError from "@/errors/InvalidValueError";
import { getNumberByMonth } from "@/utils/mapMonths";
import { Month } from "@prisma/client";
import calculationIsAfterOfDateOfEntry from "./calculationIsAfterOfDateOfEntry";

export default class CalculationValidator {
  constructor(
    private calculationsCollection: Calculations,
    private year: number = 0,
    private official: Official = Official.default(),
    private calculations: Calculation[] = []
  ) {}

  async validate(
    {
      calculations,
      official,
      year,
    }: {
      calculations: Calculation[] | undefined;
      official: Official | undefined;
      year: number | undefined;
    },
    getAndTranformCalculations: () => Promise<Calculation[]>
  ): Promise<void> {
    this.entryPointIsValid({
      calculations,
      official,
      year,
    });

    if (Calculation.calculationsHasMoreLaterHours(this.calculations)) {
      this.checkCalculationsAreAfterDateOfEntry();
    }

    this.calculations = await getAndTranformCalculations();

    this.tryAllMonthsHaveHours();
  }

  checkCalculationsAreAfterDateOfEntry(): void {
    const { calculations, official, year } = this;
    const slowestCalculation =
      this.calculationsCollection.getSmallestCalculation(calculations);

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
  }

  private entryPointIsValid({
    calculations,
    official,
    year,
  }: {
    calculations?: Calculation[];
    year?: number;
    official?: Official;
  }) {
    if (!calculations || !Array.isArray(calculations)) {
      throw new Error("calculations must be an array");
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
    if (this.calculations.length === 0) {
      throw new Error("calculations must have at least one element");
    }

    const { dateOfEntry } = this.official;
    const dateOfEntryYear = dateOfEntry.year;
    const dateOfEntryMonth = dateOfEntry.month;
    const firstMonth =
      dateOfEntryYear === this.calculations[0].year
        ? dateOfEntryMonth
        : getNumberByMonth(Month.JANUARY);
    const lastMonthName = this.calculationsCollection.getBiggestCalculation(
      this.calculations
    ).month;
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

  private tryAllMonthsHaveHours() {
    this.officialIsDefined(this.official);

    if (!this.allMonthsHaveHours()) {
      throw new InvalidValueError("All months must have hours");
    }
  }
}
