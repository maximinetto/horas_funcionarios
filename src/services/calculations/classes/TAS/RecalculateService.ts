import { CalculationCalculated } from "@/@types/calculations";
import { logger } from "@/config";
import Calculation from "@/entities/Calculation";
import { CalculationRepository } from "@/persistence/calculations";
import { getCurrentActualHourlyBalance } from "@/services/hourlyBalances";
import ActualHourlyBalanceReplacer from "@/services/hourlyBalances/ActualHourlyBalanceReplacer";
import { HourlyBalance, HourlyBalanceTAS, Official } from "@prisma/client";
import { Dictionary } from "lodash";
import _groupBy from "lodash/groupBy";
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

    const entries = this.groupAndSortCalculations(calculations);

    logger.debug("hola");
    return this.recalculateLaterHours(
      entries,
      official,
      previousActualHourlyBalances
    );
  }

  hasMoreLaterHours(calculations: Calculation[]) {
    return calculations.length > 0;
  }

  groupAndSortCalculations(calculations: Calculation[]) {
    const calculationsGrouped = _groupBy(calculations, "year");

    return this.sortCalculations(calculationsGrouped);
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
      await this.recalculateRow({
        year,
        calculations,
        official,
        previousActualHourlyBalances,
        dataToSave,
      });
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
    dataToSave,
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

    logger.info("previousActualHourlyBalanceSaved", {
      previousActualHourlyBalanceCalculated,
    });

    logger.info("yearNumber", { yearNumber });

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

    logger.info("balances", { balances: data.balances });

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
    dataToSave.push(data);
    this.actualHourlyBalances.push(actualHourlyBalance);
  }

  sortCalculations(entries: Dictionary<Calculation[]>) {
    const result = Object.entries(entries);
    result.sort(([ya], [yb]) => Number(ya) - Number(yb));
    return result;
  }
}
