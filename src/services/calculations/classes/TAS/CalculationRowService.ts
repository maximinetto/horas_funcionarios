import { CalculationCalculated } from "@/@types/calculations";
import Calculations from "@/collections/Calculations";
import ActualBalance from "@/entities/ActualBalance";
import Calculation from "@/entities/Calculation";
import CalculationTAS from "@/entities/CalculationTAS";
import Official from "@/entities/Official";

import HoursTASCalculator from "./HoursTASCalculator";

export default class CalculationRowService {
  calculate(
    {
      year,
      official,
      calculations,
      actualHourlyBalance,
      calculationsFromPersistence,
    }: {
      year: number;
      official: Official;
      calculations: Calculations<CalculationTAS>;
      actualHourlyBalance?: ActualBalance;
      calculationsFromPersistence: Calculations<Calculation>;
    },
    calculateService: HoursTASCalculator
  ): Promise<CalculationCalculated> {
    const hourlyBalances = actualHourlyBalance
      ? actualHourlyBalance.hourlyBalances
      : [];

    return calculateService.calculate({
      year,
      official,
      calculations,
      hourlyBalances,
      calculationsFromPersistence,
    });
  }

  reCalculate(
    {
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
    },
    calculateService: HoursTASCalculator
  ) {
    return this.calculate(
      {
        calculations,
        official,
        actualHourlyBalance,
        year,
        calculationsFromPersistence,
      },
      calculateService
    );
  }
}
