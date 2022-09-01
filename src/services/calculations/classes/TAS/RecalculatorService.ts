import Calculations from "collections/Calculations";
import ActualBalance from "entities/ActualBalance";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";
import Official from "entities/Official";
import CalculationRepository from "persistence/Calculation/CalculationRepository";
import ActualHourlyBalanceReplacer from "services/hourlyBalances/ActualHourlyBalanceReplacer";
import { CalculationCalculated } from "types/calculations";

import CalculatorRowService from "./CalculatorRowService";

export default class RecalculatorService {
  private calculationRepository: CalculationRepository;
  private calculatorRowService: CalculatorRowService;
  private actualHourlyBalanceReplacer: ActualHourlyBalanceReplacer;
  private actualHourlyBalances: ActualBalance[] = [];

  constructor({
    actualHourlyBalanceReplacer,
    calculationRepository,
    calculatorRowService,
  }: {
    calculationRepository: CalculationRepository;
    calculatorRowService: CalculatorRowService;
    actualHourlyBalanceReplacer: ActualHourlyBalanceReplacer;
  }) {
    this.calculationRepository = calculationRepository;
    this.calculatorRowService = calculatorRowService;
    this.actualHourlyBalanceReplacer = actualHourlyBalanceReplacer;
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

    const calculationEntities =
      await this.calculationRepository.getCalculationWithYearGreaterThanActual({
        officialId: official.id,
        type: official.type,
        year,
      });

    const calculations = new Calculations(...calculationEntities);

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
    const calculations = next.getCalculations() as CalculationTAS[];

    const data = await this.calculatorRowService.reCalculate({
      calculations: new Calculations(),
      official,
      actualHourlyBalance: previous,
      year: yearNumber,
      calculationsFromPersistence: new Calculations(...calculations),
    });

    const actualHourlyBalance = this.actualHourlyBalanceReplacer.replace({
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
      a.setCalculations(rest);
    }
  }
}
