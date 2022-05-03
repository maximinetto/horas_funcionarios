import { CalculationTAS } from "@/@types/calculations";
import { calculationTasFromArray } from "@/mappers/EntityToDTO";
import {
  Calculation,
  HourlyBalance,
  HourlyBalanceTAS,
  Official,
} from "@prisma/client";
import CalculateForTas from "./CalculateForTAS";

export default class CalculationRowService {
  async calculate(
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
  ) {
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
      calculations: Calculation[];
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
      year: string;
      calculationsFromPersistence: Calculation[];
    },
    calculateService: CalculateForTas
  ) {
    return this.calculate(
      {
        calculations: calculationTasFromArray(calculations),
        official,
        actualHourlyBalance,
        year: Number(year),
        calculationsFromPersistence,
      },
      calculateService
    );
  }
}
