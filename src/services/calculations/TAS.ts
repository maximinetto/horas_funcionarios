import Calculations from "collections/Calculations";
import { logger } from "config";
import { balances, calculatorRowService } from "dependencies/container";
import ActualBalance from "entities/ActualBalance";
import CalculationTAS from "entities/CalculationTAS";
import Official from "entities/Official";
import ValueNotProvidedError from "errors/ValueNotProvidedError";
import RecalculatorService from "services/calculations/classes/TAS/RecalculatorService";
import ActualHourlyBalanceCreator from "services/hourlyBalances/ActualHourlyBalanceCreator";
import ActualHourlyBalanceReplacer from "services/hourlyBalances/ActualHourlyBalanceReplacer";
import { CalculationCalculated } from "types/calculations";

import { getCurrentActualHourlyBalance } from "../hourlyBalances";

export default class TASCalculator {
  private actualHourlyBalanceReplacer: ActualHourlyBalanceReplacer;
  private actualHourlyBalanceCreator: ActualHourlyBalanceCreator;
  private recalculatorService: RecalculatorService;
  private official?: Official;

  constructor({
    actualHourlyBalanceReplacer,
    recalculatorService,
    actualHourlyBalanceCreator,
  }: {
    actualHourlyBalanceReplacer: ActualHourlyBalanceReplacer;
    recalculatorService: RecalculatorService;
    actualHourlyBalanceCreator: ActualHourlyBalanceCreator;
  }) {
    this.actualHourlyBalanceReplacer = actualHourlyBalanceReplacer;
    this.recalculatorService = recalculatorService;
    this.actualHourlyBalanceCreator = actualHourlyBalanceCreator;
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
    this.officialIsDefinite();

    const actualHourlyBalancesAfterPreviousYear = await balances.calculate({
      year: previousYear,
      officialId: official.id,
    });

    const previousActualBalance = getCurrentActualHourlyBalance(
      actualHourlyBalancesAfterPreviousYear,
      previousYear
    );
    const dataCalculated = await calculatorRowService.calculate({
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

    save(postCalculatedData.data);
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
      });

    save([dataCalculated]);

    return {
      currentYear: dataCalculated,
      others: [],
      actualHourlyBalances: [actualHourlyBalanceCalculated],
    };
  }

  getNextYear(year: number) {
    return year + 1;
  }

  private officialIsDefinite() {
    if (!this.official) {
      throw new ValueNotProvidedError("You must provide a official");
    }
  }
}

function save(calculations: CalculationCalculated[]) {
  logger.debug(calculations);
}
