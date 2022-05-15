import { CalculationCalculated } from "@/@types/calculations";
import Calculation from "@/entities/Calculation";
import CalculationTAS from "@/entities/CalculationTAS";
import { HourlyBalance, HourlyBalanceTAS, Official } from "@prisma/client";
import CalculateForTas from "./CalculateForTAS";

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
    calculateService: CalculateForTas
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
    calculateService: CalculateForTas
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
