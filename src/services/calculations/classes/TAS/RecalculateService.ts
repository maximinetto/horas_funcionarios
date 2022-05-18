import { CalculationCalculated } from "@/@types/calculations";
import Calculation from "@/entities/Calculation";
import { CalculationRepository } from "@/persistence/calculations";
import { getCurrentActualHourlyBalance } from "@/services/hourlyBalances";
import ActualHourlyBalanceReplacer from "@/services/hourlyBalances/ActualHourlyBalanceReplacer";
import groupAndSortCalculations from "@/sorters/CalculationSorterAndGrouper";
import { HourlyBalance, HourlyBalanceTAS, Official } from "@prisma/client";
import CalculationRowService from "./CalculationRowService";
import HoursTASCalculator from "./HoursTASCalculator";

export default class RecalculateService {
  private calculationRepository: CalculationRepository;
  private calculationRowService: CalculationRowService;
  private calculateService: HoursTASCalculator;
  private actualBalanceReplacer: ActualHourlyBalanceReplacer;
  private actualHourlyBalances: {
    hourlyBalances: (HourlyBalance & {
      hourlyBalanceTAS: HourlyBalanceTAS | null;
    })[];
    id: string;
    year: number;
    total: bigint;
    officialId: number;
  }[] = [];

  constructor(
    calculationRepository: CalculationRepository,
    calculationRowService: CalculationRowService,
    calculateService: HoursTASCalculator,
    actualBalanceReplacer: ActualHourlyBalanceReplacer
  ) {
    this.calculationRepository = calculationRepository;
    this.calculationRowService = calculationRowService;
    this.calculateService = calculateService;
    this.actualBalanceReplacer = actualBalanceReplacer;
  }

  async tryToRecalculateLaterHours({
    official,
    year,
    previousActualHourlyBalances,
    actualHourlyBalanceCalculated,
  }: {
    official: Official;
    year: number;
    previousActualHourlyBalances: {
      hourlyBalances: (HourlyBalance & {
        hourlyBalanceTAS: HourlyBalanceTAS | null;
      })[];
      id: string;
      year: number;
      total: bigint;
      officialId: number;
    }[];
    actualHourlyBalanceCalculated: {
      hourlyBalances: (HourlyBalance & {
        hourlyBalanceTAS: HourlyBalanceTAS | null;
      })[];
      id: string;
      year: number;
      total: bigint;
      officialId: number;
    };
  }) {
    const calculations = await this.calculationRepository.get(
      {
        year: {
          gte: year,
        },
        actualBalance: {
          officialId: official.id,
        },
      },
      {
        include: {
          calculationTAS: true,
        },
      }
    );

    if (!this.hasMoreLaterHours(calculations)) return;

    this.actualHourlyBalances.push(actualHourlyBalanceCalculated);

    const entries = groupAndSortCalculations(calculations);

    return this.recalculateLaterHours(
      entries,
      official,
      previousActualHourlyBalances
    );
  }

  hasMoreLaterHours(calculations: Calculation[]) {
    return calculations.length > 0;
  }

  async recalculateLaterHours(
    entries: [string, Calculation[]][],
    official: Official,
    previousActualHourlyBalances: {
      hourlyBalances: (HourlyBalance & {
        hourlyBalanceTAS: HourlyBalanceTAS | null;
      })[];
      id: string;
      year: number;
      total: bigint;
      officialId: number;
    }[]
  ) {
    const dataToSave: CalculationCalculated[] = [];

    for (const [year, calculations] of entries) {
      dataToSave.push(
        await this.recalculateRow({
          year,
          calculations,
          official,
          previousActualHourlyBalances,
          dataToSave,
        })
      );
    }

    return {
      data: dataToSave,
      actualHourlyBalances:
        this.actualHourlyBalances.length >= 1
          ? this.actualHourlyBalances.slice(1)
          : [],
    };
  }

  async recalculateRow({
    year,
    calculations,
    previousActualHourlyBalances,
    official,
  }: {
    year: string;
    calculations: Calculation[];
    official: Official;
    previousActualHourlyBalances: {
      hourlyBalances: (HourlyBalance & {
        hourlyBalanceTAS: HourlyBalanceTAS | null;
      })[];
      id: string;
      year: number;
      total: bigint;
      officialId: number;
    }[];
    dataToSave: CalculationCalculated[];
  }) {
    const yearNumber = Number(year);
    const previousActualHourlyBalanceCalculated =
      this.actualHourlyBalances[this.actualHourlyBalances.length - 1];

    const data = await this.calculationRowService.reCalculate(
      {
        calculations: [],
        official,
        actualHourlyBalance: previousActualHourlyBalanceCalculated,
        year: yearNumber,
        calculationsFromPersistence: calculations,
      },
      this.calculateService
    );

    const actualHourlyBalanceToReplace = getCurrentActualHourlyBalance(
      previousActualHourlyBalances,
      yearNumber
    );
    if (!actualHourlyBalanceToReplace) {
      throw new Error(
        "Internal error: no actual hourly balance found for year " + yearNumber
      );
    }
    const actualHourlyBalance = this.actualBalanceReplacer.replace({
      actualBalance: actualHourlyBalanceToReplace,
      balances: data.balances,
      totalBalance: data.totalBalance,
    });
    this.actualHourlyBalances.push(actualHourlyBalance);
    return data;
  }
}
