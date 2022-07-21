import { CalculationCalculated } from "@/@types/calculations";
import Calculations from "@/collections/Calculations";
import BalanceConverter from "@/converters/BalanceConverter";
import ActualBalance from "@/entities/ActualBalance";
import CalculationTAS from "@/entities/CalculationTAS";
import Official from "@/entities/Official";
import { ActualBalanceRepository } from "@/persistence/actualBalance";
import { CalculationRepository } from "@/persistence/calculations";

import { balances, getCurrentActualHourlyBalance } from "../hourlyBalances";
import ActualHourlyBalanceCreator from "../hourlyBalances/ActualHourlyBalanceCreator";
import ActualHourlyBalanceReplacer from "../hourlyBalances/ActualHourlyBalanceReplacer";
import CalculationValidator from "./classes/CalculationValidator";
import CalculationRowService from "./classes/TAS/CalculationRowService";
import HoursTASCalculator from "./classes/TAS/HoursTASCalculator";
import RecalculateService from "./classes/TAS/RecalculateService";

export default async function calculateForTAS({
  year: currentYear,
  official,
  calculations,
  calculationRowService = new CalculationRowService(),
  calculationRepository = new CalculationRepository(),
  actualBalanceRepository = new ActualBalanceRepository(),
  balanceConverter = new BalanceConverter(),
  actualBalanceCreator = new ActualHourlyBalanceCreator(),
  actualBalanceReplacer = new ActualHourlyBalanceReplacer(
    balanceConverter,
    actualBalanceCreator
  ),
  calculateService = new HoursTASCalculator(
    calculationRepository,
    new CalculationValidator()
  ),
  recalculateService = new RecalculateService(
    calculationRepository,
    calculationRowService,
    calculateService,
    actualBalanceReplacer
  ),
}: {
  year: number;
  official: Official;
  calculations: Calculations<CalculationTAS>;
  calculationRowService?: CalculationRowService;
  calculationRepository?: CalculationRepository;
  actualBalanceRepository?: ActualBalanceRepository;
  actualBalanceCreator?: ActualHourlyBalanceCreator;
  actualBalanceReplacer?: ActualHourlyBalanceReplacer;
  balanceConverter?: BalanceConverter;
  calculateService?: HoursTASCalculator;
  recalculateService?: RecalculateService;
}): Promise<{
  currentYear: CalculationCalculated;
  others: CalculationCalculated[];
  actualHourlyBalances: ActualBalance[];
}> {
  async function main(): Promise<{
    currentYear: CalculationCalculated;
    others: CalculationCalculated[];
    actualHourlyBalances: ActualBalance[];
  }> {
    const previousYear = currentYear - 1;
    const actualHourlyBalancesAfterPreviousYear = await balances({
      year: previousYear,
      officialId: official.id,
      actualBalanceRepository,
    });

    const previousActualBalance = getCurrentActualHourlyBalance(
      actualHourlyBalancesAfterPreviousYear,
      previousYear
    );
    const dataCalculated = await calculationRowService.calculate(
      {
        year: currentYear,
        official,
        calculations,
        actualHourlyBalance: previousActualBalance,
        calculationsFromPersistence: new Calculations(),
      },
      calculateService
    );

    const actualBalanceCurrentYear = getCurrentActualHourlyBalance(
      actualHourlyBalancesAfterPreviousYear,
      currentYear
    );

    if (!actualBalanceCurrentYear) {
      return createActualBalance(dataCalculated, currentYear, official);
    }

    const actualHourlyBalanceCalculated = actualBalanceReplacer.replace({
      balances: dataCalculated.balances,
      totalBalance: dataCalculated.totalBalance,
      actualBalance: actualBalanceCurrentYear,
    });

    const nextYear = getNextYear(actualHourlyBalanceCalculated.year);

    const others = await recalculate(
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

  async function recalculate(
    nextYear: number,
    actualHourlyBalancesAfterPreviousYear: ActualBalance[],
    actualHourlyBalanceCalculated: ActualBalance
  ) {
    const postCalculatedData =
      await recalculateService.tryToRecalculateLaterHours({
        official,
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

  function createActualBalance(
    dataCalculated: CalculationCalculated,
    nextYear: number,
    official: Official
  ) {
    const actualHourlyBalanceCalculated = actualBalanceCreator.create({
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

  function getNextYear(year: number) {
    return year + 1;
  }

  return main();
}

function save(calculations: CalculationCalculated[]) {
  console.log(calculations);
}
