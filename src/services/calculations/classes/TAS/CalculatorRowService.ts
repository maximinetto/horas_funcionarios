import Calculations from "collections/Calculations";
import ActualBalance from "entities/ActualBalance";
import CalculationTAS from "entities/CalculationTAS";
import Official from "entities/Official";
import sort from "services/hourlyBalances/HourlyBalancesSorter";
import { CalculationCalculated } from "types/calculations";

import HoursTASCalculator from "./HoursTASCalculator";

export default class CalculatorRowService {
  private hoursTASCalculator: HoursTASCalculator;

  constructor({
    hoursTASCalculator,
  }: {
    hoursTASCalculator: HoursTASCalculator;
  }) {
    this.hoursTASCalculator = hoursTASCalculator;
  }

  calculate({
    year,
    official,
    calculations,
    actualHourlyBalance,
    calculationsFromPersistence,
  }: {
    year: number;
    official: Official;
    calculations: Calculations<CalculationTAS>;
    calculationsFromPersistence: Calculations<CalculationTAS>;
    actualHourlyBalance?: ActualBalance;
  }): Promise<CalculationCalculated> {
    let hourlyBalances = actualHourlyBalance
      ? actualHourlyBalance.getHourlyBalances()
      : [];

    hourlyBalances = sort(hourlyBalances);

    return this.hoursTASCalculator.calculate({
      year,
      official,
      calculations,
      hourlyBalances,
      calculationsFromPersistence,
    });
  }

  reCalculate({
    calculations,
    official,
    actualHourlyBalance,
    year,
    calculationsFromPersistence,
  }: {
    calculations: Calculations<CalculationTAS>;
    official: Official;
    actualHourlyBalance: ActualBalance;
    year: number;
    calculationsFromPersistence: Calculations<CalculationTAS>;
  }) {
    return this.calculate({
      calculations,
      official,
      actualHourlyBalance,
      year,
      calculationsFromPersistence,
    });
  }
}
