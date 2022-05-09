import { CalculationCalculated, CalculationTAS } from "@/@types/calculations";
import BalanceConverter from "@/converters/BalanceConverter";
import { ActualBalanceRepository } from "@/persistence/actualBalance";
import { CalculationRepository } from "@/persistence/calculations";
import CalculateForTas from "@/services/calculations/classes/TAS/CalculateForTAS";
import CalculationRowService from "@/services/calculations/classes/TAS/CalculationRowService";
import { HourlyBalance, HourlyBalanceTAS, Official } from "@prisma/client";
import { balances, getCurrentActualHourlyBalance } from "../hourlyBalances";
import ActualHourlyBalanceCreator from "../hourlyBalances/ActualHourlyBalanceCreator";
import ActualHourlyBalanceReplacer from "../hourlyBalances/ActualHourlyBalanceReplacer";
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
  calculateService = new CalculateForTas(calculationRepository),
  recalculateService = new RecalculateService(
    calculationRepository,
    calculationRowService,
    calculateService,
    actualBalanceReplacer
  ),
}: {
  year: number;
  official: Official;
  calculations: CalculationTAS[];
  calculationRowService?: CalculationRowService;
  calculationRepository?: CalculationRepository;
  actualBalanceRepository?: ActualBalanceRepository;
  actualBalanceCreator?: ActualHourlyBalanceCreator;
  actualBalanceReplacer?: ActualHourlyBalanceReplacer;
  balanceConverter?: BalanceConverter;
  calculateService?: CalculateForTas;
  recalculateService?: RecalculateService;
}) {
  async function main() {
    const previousYear = currentYear - 1;
    const previousActualHourlyBalances = await balances({
      year: previousYear,
      officialId: official.id,
      actualBalanceRepository,
    });

    const previousActualBalance = getCurrentActualHourlyBalance(
      previousActualHourlyBalances,
      previousYear
    );
    const dataCalculated = await calculationRowService.calculate(
      {
        year: currentYear,
        official,
        calculations,
        actualHourlyBalance: previousActualBalance,
      },
      calculateService
    );

    const actualBalanceCurrentYear = getCurrentActualHourlyBalance(
      previousActualHourlyBalances,
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
      previousActualHourlyBalances,
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
    previousActualHourlyBalances: {
      hourlyBalances: (HourlyBalance & {
        hourlyBalanceTAS: HourlyBalanceTAS | null;
      })[];
      id: string;
      year: number;
      total: bigint;
      officialId: number;
    }[],
    actualHourlyBalanceCalculated: {
      hourlyBalances: (HourlyBalance & {
        hourlyBalanceTAS: HourlyBalanceTAS | null;
      })[];
      id: string;
      year: number;
      total: bigint;
      officialId: number;
    }
  ) {
    const postCalculatedData =
      await recalculateService.tryToRecalculateLaterHours({
        official,
        year: nextYear,
        previousActualHourlyBalances,
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

function save(calculations: CalculationCalculated[]) {}
