import Calculations from "collections/Calculations";
import Decimal from "decimal.js";
import Calculation from "entities/Calculation";
import HourlyBalance from "entities/HourlyBalance";
import ICalculation from "entities/interfaces/ICalculation";
import Official from "entities/Official";
import type CalculationRepository from "persistence/Calculation/CalculationRepository";
import CalculatePerMonth, {
  CalculatePerMonthAlternative,
} from "services/calculations/classes/CalculatePerMonth";
import CalculationCreator from "services/calculations/classes/CalculationCreator";
import CalculationValidator from "services/calculations/classes/CalculationValidator";
import CalculationSorter from "sorters/CalculationSorter";
import { CalculationCalculated, CalculationParam } from "types/calculations";

export default abstract class HoursCalculator {
  protected calculationRepository: CalculationRepository;
  protected calculationsFromPersistence: Calculations<Calculation>;
  protected calculations: Calculations<Calculation>;
  protected year?: number;
  protected official?: Official;
  protected hourlyBalances: Array<HourlyBalance>;
  protected calculationsSorter: CalculationSorter;
  protected calculationCreator: CalculationCreator;
  private calculationValidator: CalculationValidator;

  constructor({
    calculationCreator,
    calculationRepository,
    calculationSorter,
    calculationValidator,
  }: {
    calculationRepository: CalculationRepository;
    calculationCreator: CalculationCreator;
    calculationValidator: CalculationValidator;
    calculationSorter: CalculationSorter;
  }) {
    this.calculationRepository = calculationRepository;
    this.calculationCreator = calculationCreator;
    this.calculations = new Calculations();
    this.calculationsFromPersistence = new Calculations<Calculation>();
    this.hourlyBalances = [];
    this.calculationsSorter = calculationSorter;
    this.calculationValidator = calculationValidator;
    this.getCalculationsAndTransform =
      this.getCalculationsAndTransform.bind(this);
  }

  abstract calculatePerMonthAlternatives(): Promise<CalculatePerMonthAlternative>;

  abstract calculateAccumulateHoursByYear(hours: CalculatePerMonth);

  async calculate({
    calculations: _calculations,
    year: _year,
    official: _official,
    hourlyBalances: _hourlyBalances,
    calculationsFromPersistence,
  }: CalculationParam<Calculation>): Promise<CalculationCalculated> {
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

  async getCalculationsAndTransform(): Promise<Calculations<Calculation>> {
    this.calculationValidator.officialIsDefined(this.official);
    this.calculationValidator.yearIsDefined(this.year);
    if (this.isOutsidePersistenceSet()) {
      await this.getRestOfCalculations(this.official, this.year);
    }

    this.calculations.mergeCalculations({
      origin: this.calculationsFromPersistence.toPrimitiveArray(),
      replacer: this.calculationCreator.create,
    });

    return this.calculations;
  }

  getTotalBalance(hourlyBalances: HourlyBalance[]): Promise<Decimal> {
    const totalHours = hourlyBalances.reduce((total, hourlyBalance) => {
      return total.plus(hourlyBalance.calculateTotal());
    }, new Decimal(0));

    const totalBalance = this.calculations.calc(
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
      this.calculations.calc(
        (total, calculation) =>
          total.plus(calculation.discountPerCalculation()),
        new Decimal(0)
      )
    );
  }

  protected setAttributes({
    calculations,
    year,
    official,
    hourlyBalances,
    calculationsFromPersistence,
  }: CalculationParam<Calculation>): CalculationParam<Calculation> {
    this.calculations = calculations;
    this.year = year;
    this.official = official;
    this.hourlyBalances = hourlyBalances;
    this.calculationsFromPersistence = calculationsFromPersistence;

    return {
      calculations,
      year,
      official,
      hourlyBalances,
      calculationsFromPersistence,
    };
  }

  private async getRestOfCalculations(official: Official, year: number) {
    const calculations =
      await this.calculationRepository.getCalculationsWithActualYear({
        officialId: official.id,
        type: official.type,
        year,
      });

    this.calculationsFromPersistence = new Calculations<Calculation>(
      ...calculations
    );
  }

  private isOutsidePersistenceSet() {
    return this.calculationsFromPersistence.isEmpty();
  }
}
