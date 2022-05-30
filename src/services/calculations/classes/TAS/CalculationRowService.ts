import { CalculationCalculated } from "@/@types/calculations";
import Calculation from "@/entities/Calculation";
import CalculationTAS from "@/entities/CalculationTAS";
import { HourlyBalance, HourlyBalanceTAS, Official } from "@prisma/client";
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
      calculations: CalculationTAS[];
      actualHourlyBalance?: {
        hourlyBalances: (HourlyBalance & {
          hourlyBalanceTAS: HourlyBalanceTAS | null;
        })[];
        id: string;
        year: number;
        total: bigint;
        officialId: number;
      };
      calculationsFromPersistence?: Calculation[];
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
      calculationsFromPersistence: calculationsFromPersistence ?? [],
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
      calculations: CalculationTAS[];
      official: Official;
      actualHourlyBalance: {
        hourlyBalances: (HourlyBalance & {
          hourlyBalanceTAS: HourlyBalanceTAS | null;
        })[];
        id: string;
        year: number;
        total: bigint;
        officialId: number;
      };
      year: number;
      calculationsFromPersistence: Calculation[];
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
