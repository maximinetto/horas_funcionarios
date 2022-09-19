import Calculations from "collections/Calculations";
import ActualBalance from "entities/ActualBalance";
import CalculationTAS from "entities/CalculationTAS";
import Official from "entities/Official";
import { TypeOfOfficial } from "enums/officials";
import ValueNotProvidedError from "errors/ValueNotProvidedError";
import ActualHourlyBalanceRepository from "persistence/ActualBalance/ActualHourlyBalanceRepository";
import RecalculatorService from "services/calculations/classes/TAS/RecalculatorService";
import Balances, {
  getCurrentActualHourlyBalance,
} from "services/hourlyBalances";
import ActualHourlyBalanceCreator from "services/hourlyBalances/ActualHourlyBalanceCreator";
import ActualHourlyBalanceReplacer from "services/hourlyBalances/ActualHourlyBalanceReplacer";
import ActualHourlyBalanceSaver from "services/hourlyBalances/ActualHourlyBalanceSaver";
import { CalculationCalculated } from "types/calculations";

import CalculatorRowService from "./classes/TAS/CalculatorRowService";

export default class TASCalculator {
  private actualHourlyBalanceReplacer: ActualHourlyBalanceReplacer;
  private actualHourlyBalanceCreator: ActualHourlyBalanceCreator;
  private recalculatorService: RecalculatorService;
  private calculatorRowService: CalculatorRowService;
  private actualHourlyBalanceSaver: ActualHourlyBalanceSaver;
  private official?: Official;
  private balances: Balances;

  constructor({
    actualHourlyBalanceReplacer,
    recalculatorService,
    actualHourlyBalanceCreator,
    calculatorRowService,
    actualHourlyBalanceRepository,
  }: {
    actualHourlyBalanceReplacer: ActualHourlyBalanceReplacer;
    recalculatorService: RecalculatorService;
    actualHourlyBalanceCreator: ActualHourlyBalanceCreator;
    calculatorRowService: CalculatorRowService;
    actualHourlyBalanceRepository: ActualHourlyBalanceRepository;
  }) {
    this.actualHourlyBalanceReplacer = actualHourlyBalanceReplacer;
    this.recalculatorService = recalculatorService;
    this.actualHourlyBalanceCreator = actualHourlyBalanceCreator;
    this.balances = new Balances({ actualHourlyBalanceRepository });
    this.calculatorRowService = calculatorRowService;
    this.actualHourlyBalanceSaver = new ActualHourlyBalanceSaver({
      actualHourlyBalanceRepository,
    });
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

    // console.log(
    //   "actualHourlyBalancesAfterPreviousYear:",
    //   actualHourlyBalancesAfterPreviousYear
    // );

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

    // console.log(
    //   "actualHourlyBalancesAfterPreviousYear",
    //   actualHourlyBalancesAfterPreviousYear
    // );
    // console.log("actualBalanceCurrentYear", actualBalanceCurrentYear);
    if (!actualBalanceCurrentYear) {
      return this.createActualBalance(dataCalculated, currentYear, official);
    }

    const actualHourlyBalanceCalculated =
      this.actualHourlyBalanceReplacer.replace({
        balances: dataCalculated.balances,
        totalBalance: dataCalculated.totalBalance,
        actualBalance: actualBalanceCurrentYear,
        calculations: dataCalculated.calculations,
        official,
      });

    // console.log(
    //   "actualHourlyBalanceCalculated:",
    //   actualHourlyBalanceCalculated
    // );

    const nextYear = this.getNextYear(actualHourlyBalanceCalculated.year);

    const others = await this.recalculate(
      nextYear,
      actualHourlyBalancesAfterPreviousYear,
      actualHourlyBalanceCalculated
    );
    this.actualHourlyBalanceSaver.save([
      actualHourlyBalanceCalculated,
      ...others.actualHourlyBalances,
    ]);

    // console.log("dataCalculated.calculations:", dataCalculated.calculations);

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
        official,
        total: dataCalculated.totalBalance,
        calculations: dataCalculated.calculations,
        type: TypeOfOfficial.TAS,
      });

    this.actualHourlyBalanceSaver.save([actualHourlyBalanceCalculated]);

    return {
      currentYear: dataCalculated,
      others: [],
      actualHourlyBalances: [actualHourlyBalanceCalculated],
    };
  }

  getNextYear(year: number) {
    return year + 1;
  }

  private officialIsDefined() {
    if (!this.official) {
      throw new ValueNotProvidedError("You must provide a official");
    }
  }
}
