import Calculations from "collections/Calculations";
import ActualBalance from "entities/ActualBalance";
import CalculationTAS from "entities/CalculationTAS";
import Official from "entities/Official";
import ValueNotProvidedError from "errors/ValueNotProvidedError";
import RecalculatorService from "services/calculations/classes/TAS/RecalculatorService";
import Balances, {
  getCurrentActualHourlyBalance,
} from "services/hourlyBalances";
import ActualHourlyBalanceCreator from "services/hourlyBalances/ActualHourlyBalanceCreator";
import ActualHourlyBalanceReplacer from "services/hourlyBalances/ActualHourlyBalanceReplacer";
import { CalculationCalculated } from "types/calculations";

import CalculatorRowService from "./classes/TAS/CalculatorRowService";

export default class TASCalculator {
  private actualHourlyBalanceReplacer: ActualHourlyBalanceReplacer;
  private actualHourlyBalanceCreator: ActualHourlyBalanceCreator;
  private recalculatorService: RecalculatorService;
  private calculatorRowService: CalculatorRowService;
  private official?: Official;
  private balances: Balances;

  constructor({
    actualHourlyBalanceReplacer,
    recalculatorService,
    actualHourlyBalanceCreator,
    balances,
    calculatorRowService,
  }: {
    actualHourlyBalanceReplacer: ActualHourlyBalanceReplacer;
    recalculatorService: RecalculatorService;
    actualHourlyBalanceCreator: ActualHourlyBalanceCreator;
    balances: Balances;
    calculatorRowService: CalculatorRowService;
  }) {
    this.actualHourlyBalanceReplacer = actualHourlyBalanceReplacer;
    this.recalculatorService = recalculatorService;
    this.actualHourlyBalanceCreator = actualHourlyBalanceCreator;
    this.balances = balances;
    this.calculatorRowService = calculatorRowService;
  }

  async calculate({
    year: currentYear,
    official,
    calculations,
  }: {
    year: number;
    official: Official;
    calculations: Calculations<CalculationTAS>;
  }): Promise<{
    currentYear: CalculationCalculated;
    others: CalculationCalculated[];
    actualHourlyBalances: ActualBalance[];
  }> {
    const previousYear = currentYear - 1;
    this.official = official;
    this.officialIsDefined();

    const actualHourlyBalancesAfterPreviousYear = await this.balances.calculate(
      {
        year: previousYear,
        officialId: official.id,
      }
    );

    const previousActualBalance = getCurrentActualHourlyBalance(
      actualHourlyBalancesAfterPreviousYear,
      previousYear
    );
    const dataCalculated = await this.calculatorRowService.calculate({
      year: currentYear,
      official,
      calculations,
      actualHourlyBalance: previousActualBalance,
      calculationsFromPersistence: new Calculations(),
    });

    const actualBalanceCurrentYear = getCurrentActualHourlyBalance(
      actualHourlyBalancesAfterPreviousYear,
      currentYear
    );

    if (!actualBalanceCurrentYear) {
      return this.createActualBalance(dataCalculated, currentYear, official);
    }

    const actualHourlyBalanceCalculated =
      this.actualHourlyBalanceReplacer.replace({
        balances: dataCalculated.balances,
        totalBalance: dataCalculated.totalBalance,
        actualBalance: actualBalanceCurrentYear,
      });

    const nextYear = this.getNextYear(actualHourlyBalanceCalculated.year);

    const others = await this.recalculate(
      nextYear,
      actualHourlyBalancesAfterPreviousYear,
      actualHourlyBalanceCalculated
    );

    this.save([actualHourlyBalanceCalculated, ...others.actualHourlyBalances]);
    return {
      currentYear: dataCalculated,
      ...others,
      actualHourlyBalances: [
        actualHourlyBalanceCalculated,
        ...others.actualHourlyBalances,
      ],
    };
  }

  private async recalculate(
    nextYear: number,
    actualHourlyBalancesAfterPreviousYear: ActualBalance[],
    actualHourlyBalanceCalculated: ActualBalance
  ) {
    const postCalculatedData =
      await this.recalculatorService.tryToRecalculateLaterHours({
        official: this.official!,
        year: nextYear,
        currentActualHourlyBalances: actualHourlyBalancesAfterPreviousYear,
        actualHourlyBalanceCalculated,
      });
    if (!postCalculatedData)
      return {
        others: [],
        actualHourlyBalances: [],
      };

    return {
      others: postCalculatedData.data,
      actualHourlyBalances: [...postCalculatedData.actualHourlyBalances],
    };
  }

  createActualBalance(
    dataCalculated: CalculationCalculated,
    nextYear: number,
    official: Official
  ) {
    const actualHourlyBalanceCalculated =
      this.actualHourlyBalanceCreator.create({
        balances: dataCalculated.balances,
        year: nextYear,
        officialId: official.id,
        total: dataCalculated.totalBalance,
        calculations: dataCalculated.calculations,
        type: "tas",
      });

    return {
      currentYear: dataCalculated,
      others: [],
      actualHourlyBalances: [actualHourlyBalanceCalculated],
    };
  }

  getNextYear(year: number) {
    return year + 1;
  }

  private save(actualBalances: ActualBalance[]) {
    const [first, ...others] = actualBalances;
  }

  private officialIsDefined() {
    if (!this.official) {
      throw new ValueNotProvidedError("You must provide a official");
    }
  }
}
