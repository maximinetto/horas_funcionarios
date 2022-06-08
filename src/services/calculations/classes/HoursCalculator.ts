import {
  CalculationCalculated,
  CalculationParam,
  PrismaCalculationFinderOptions,
} from "@/@types/calculations";
import Calculations from "@/collections/Calculations";
import Calculation from "@/entities/Calculation";
import HourlyBalance from "@/entities/HourlyBalance";
import ICalculation from "@/entities/ICalculation";
import Official from "@/entities/Official";
import type { CalculationRepository } from "@/persistence/calculations";
import CalculationSorter from "@/sorters/CalculationSorter";
import Decimal from "decimal.js";
import CalculatePerMonth, {
  CalculatePerMonthAlternative,
} from "./CalculatePerMonth";
import CalculationCreator from "./CalculationCreator";
import CalculationValidator from "./CalculationValidator";
export default abstract class HoursCalculator {
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
  private calculationValidator: CalculationValidator;

  constructor(
    calculationRepository: CalculationRepository,
    calculationCreator: CalculationCreator,
    selectOptions: PrismaCalculationFinderOptions,
    calculationValidator: CalculationValidator
  ) {
    this.calculationRepository = calculationRepository;
    this.calculationCreator = calculationCreator;
    this.calculations = [];
    this.calculationsFromPersistence = [];
    this.hourlyBalances = [];
    this.calculationsSorter = new CalculationSorter();
    this.calculationsCollection = new Calculations();
    this.selectOptions = selectOptions;
    this.calculationValidator = calculationValidator;
    this.getCalculationsAndTransform =
      this.getCalculationsAndTransform.bind(this);
  }

  abstract calculatePerMonthAlternatives(): Promise<CalculatePerMonthAlternative>;

  abstract calculateAccumulateHoursByYear(hours: CalculatePerMonth);

  async calculatePerMonth(
    hourlyBalances: HourlyBalance[]
  ): Promise<CalculatePerMonth> {
    const [totalBalance, totalDiscount, others] = await Promise.all([
      this.getTotalBalance(hourlyBalances),
      this.getTotalDiscount(),
      this.calculatePerMonthAlternatives(),
    ]);

    return {
      totalBalance,
      totalDiscount,
      ...others,
    };
  }

  async getCalculationsAndTransform(): Promise<Calculation[]> {
    this.calculationValidator.officialIsDefined(this.official);
    this.calculationValidator.yearIsDefined(this.year);
    if (this.isOutsidePersistenceSet()) {
      await this.getRestOfCalculations(this.official, this.year);
    }

    this.calculations = this.calculationsCollection.mergeCalculations(
      this.calculationsFromPersistence,
      this.calculations,
      this.calculationCreator.create
    );

    return this.calculations;
  }

  async calculate({
    calculations: _calculations,
    calculationsFromPersistence = [],
    year: _year,
    official: _official,
    hourlyBalances: _hourlyBalances,
  }: CalculationParam): Promise<CalculationCalculated> {
    this.setAttributes({
      calculations: _calculations,
      year: _year,
      official: _official,
      hourlyBalances: _hourlyBalances,
      calculationsFromPersistence,
    });

    await this.calculationValidator.validate(
      {
        calculations: this.calculations,
        official: this.official,
        year: this.year,
      },
      this.getCalculationsAndTransform
    );
    const result = await this.calculatePerMonth(_hourlyBalances);
    return this.calculateAccumulateHoursByYear(result);
  }

  getTotalBalance(hourlyBalances: HourlyBalance[]): Promise<Decimal> {
    const totalHours = hourlyBalances.reduce((total, hourlyBalance) => {
      return total.plus(hourlyBalance.calculateTotal());
    }, new Decimal(0));

    const totalBalance = this.calculations.reduce(
      (total, calculation: ICalculation) => {
        const hours = calculation.getTotalHoursPerCalculation();
        return total.add(hours).sub(calculation.discountPerCalculation());
      },
      new Decimal(totalHours)
    );

    return Promise.resolve(totalBalance);
  }

  getTotalDiscount(): Promise<Decimal> {
    return Promise.resolve(
      this.calculations.reduce(
        (total, calculation) =>
          total.plus(calculation.discountPerCalculation()),
        new Decimal(0)
      )
    );
  }

  private setAttributes({
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

  private async getRestOfCalculations(official: Official, year: number) {
    this.calculationsFromPersistence = await this.calculationRepository.get(
      {
        actualBalance: {
          officialId: official.id,
        },
        year,
      },
      this.selectOptions
    );
  }

  private isOutsidePersistenceSet() {
    return this.calculationsFromPersistence.length === 0;
  }
}
