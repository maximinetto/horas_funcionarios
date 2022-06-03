import {
  CalculationParam,
  PrismaCalculationFinderOptions,
} from "@/@types/calculations";
import Calculations from "@/collections/Calculations";
import Calculation from "@/entities/Calculation";
import HourlyBalance from "@/entities/HourlyBalance";
import Official from "@/entities/Official";
import InvalidValueError from "@/errors/InvalidValueError";
import type { CalculationRepository } from "@/persistence/calculations";
import CalculationSorter from "@/sorters/CalculationSorter";
import { resetDateFromFirstDay } from "@/utils/date";
import { getNumberByMonth } from "@/utils/mapMonths";
import { Month } from "@prisma/client";
import { DateTime } from "luxon";
import CalculationCreator from "./CalculationCreator";
export default abstract class Calculator {
  protected calculationRepository: CalculationRepository;
  protected calculationsFromPersistence: Calculation[];
  protected calculations: Calculation[];
  protected year?: number;
  protected official?: Official;
  protected hourlyBalances: HourlyBalance[];
  protected calculationsSorter: CalculationSorter;
  protected calculationsCollection: Calculations;
  private calculationCreator: CalculationCreator;
  private selectOptions: PrismaCalculationFinderOptions;

  constructor(
    calculationRepository: CalculationRepository,
    calculationCreator: CalculationCreator,
    selectOptions: PrismaCalculationFinderOptions
  ) {
    this.calculationRepository = calculationRepository;
    this.calculations = [];
    this.calculationsFromPersistence = [];
    this.hourlyBalances = [];
    this.calculationsSorter = new CalculationSorter();
    this.calculationsCollection = new Calculations();
    this.calculationCreator = calculationCreator;
    this.selectOptions = selectOptions;
  }

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
      const slowestCalculation =
        this.calculationsCollection.getSmallestCalculation(this.calculations);

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
        this.selectOptions
      );
    }

    this.calculations = this.calculationsCollection.mergeCalculations(
      this.calculationsFromPersistence,
      this.calculations,
      this.calculationCreator.create
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

  calculationIsAfterOfDateOfEntry(
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

  allMonthsHaveHours(calculations: Calculation[]): boolean {
    if (calculations.length === 0) {
      throw new Error("calculations must have at least one element");
    }

    if (!this.official) {
      throw new Error("official must be defined");
    }

    const { dateOfEntry } = this.official;
    const dateOfEntryYear = dateOfEntry.year;
    const dateOfEntryMonth = dateOfEntry.month;
    const firstMonth =
      dateOfEntryYear === calculations[0].year
        ? dateOfEntryMonth
        : getNumberByMonth(Month.JANUARY);
    const lastMonthName =
      this.calculationsCollection.getBiggestCalculation(calculations).month;
    const lastMonthNumber = getNumberByMonth(lastMonthName);
    return calculations.every((calculation) => {
      const month = getNumberByMonth(calculation.month);
      const isBetween = month >= firstMonth && month <= lastMonthNumber;
      return isBetween;
    });
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
