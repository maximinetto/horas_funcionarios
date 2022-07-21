import { CalculationCalculated } from "@/@types/calculations";
import Calculations from "@/collections/Calculations";
import ActualBalance from "@/entities/ActualBalance";
import Calculation from "@/entities/Calculation";
import CalculationTAS from "@/entities/CalculationTAS";
import Official from "@/entities/Official";
import { CalculationRepository } from "@/persistence/calculations";
import ActualHourlyBalanceReplacer from "@/services/hourlyBalances/ActualHourlyBalanceReplacer";

import CalculationRowService from "./CalculationRowService";
import HoursTASCalculator from "./HoursTASCalculator";

export default class RecalculateService {
  private calculationRepository: CalculationRepository;
  private calculationRowService: CalculationRowService;
  private calculateService: HoursTASCalculator;
  private actualBalanceReplacer: ActualHourlyBalanceReplacer;
  private actualHourlyBalances: ActualBalance[] = [];
  f;

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
    currentActualHourlyBalances,
    actualHourlyBalanceCalculated,
  }: {
    official: Official;
    year: number;
    currentActualHourlyBalances: ActualBalance[];
    actualHourlyBalanceCalculated: ActualBalance;
  }) {
    this.actualHourlyBalances = currentActualHourlyBalances;

    const calculations = (await this.calculationRepository.get(
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
    )) as Calculations<CalculationTAS>;

    if (!Calculation.calculationsHasMoreLaterHours(calculations)) return;

    this.assignCalculations(actualHourlyBalanceCalculated, calculations);

    return this.recalculateLaterHours(official);
  }

  async recalculateLaterHours(official: Official) {
    const dataToSave: CalculationCalculated[] = [];

    for (let i = 1; i < this.actualHourlyBalances.length; i++) {
      dataToSave.push(
        await this.recalculateRow({
          official,
          index: i,
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
    official,
    index,
  }: {
    official: Official;
    index: number;
  }) {
    const previous = this.actualHourlyBalances[index - 1];
    const next = this.actualHourlyBalances[index];

    const yearNumber = Number(next.year);
    const calculations = next.calculations as CalculationTAS[];

    const data = await this.calculationRowService.reCalculate(
      {
        calculations: new Calculations(),
        official,
        actualHourlyBalance: previous,
        year: yearNumber,
        calculationsFromPersistence: new Calculations(...calculations),
      },
      this.calculateService
    );

    const actualHourlyBalance = this.actualBalanceReplacer.replace({
      actualBalance: next,
      balances: data.balances,
      totalBalance: data.totalBalance,
    });
    this.actualHourlyBalances[index] = actualHourlyBalance;
    return data;
  }

  assignCalculations(
    actualHourlyBalanceCalculated: ActualBalance,
    calculations: Calculations<Calculation>
  ) {
    this.actualHourlyBalances[0] = actualHourlyBalanceCalculated;

    for (const a of this.actualHourlyBalances) {
      const { year } = a;
      const rest = calculations.filter((c) => c.year === year);
      a.calculations = rest;
    }
  }
}
