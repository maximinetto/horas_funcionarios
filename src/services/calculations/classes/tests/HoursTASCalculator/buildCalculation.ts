import { CalculationTAS as CalculationTASModel } from "@/@types/calculations";
import ActualBalance from "@/entities/ActualBalance";
import CalculationTAS from "@/entities/CalculationTAS";
import faker from "@faker-js/faker";
import { Decimal } from "decimal.js";
import { HourlyBalanceTASNotNullable } from "./types";

export function buildCalculation(
  calculation: Omit<CalculationTASModel, "id" | "calculationId">
): CalculationTAS {
  const calculationId = faker.datatype.uuid();
  const id = faker.datatype.uuid();
  return new CalculationTAS(
    id,
    calculation.year,
    calculation.month,
    new Decimal(calculation.surplusBusiness.toString()),
    new Decimal(calculation.surplusNonWorking.toString()),
    new Decimal(calculation.surplusSimple.toString()),
    new Decimal(calculation.discount.toString()),
    new Decimal(calculation.workingOvertime.toString()),
    new Decimal(calculation.workingNightOvertime.toString()),
    new Decimal(calculation.nonWorkingOvertime.toString()),
    new Decimal(calculation.nonWorkingNightOvertime.toString()),
    new Decimal(calculation.compensatedNightOvertime.toString()),
    calculationId,
    calculation.observations ?? undefined,
    new ActualBalance(calculation.actualBalanceId, calculation.year)
  );
}

export function buildHourlyBalance({
  year,
  actualBalanceId,
  nonWorking,
  simple,
  working,
}: {
  year: number;
  working: bigint;
  nonWorking: bigint;
  simple: bigint;
  actualBalanceId: string;
}) {
  const id = faker.datatype.uuid();
  const result: HourlyBalanceTASNotNullable = {
    id,
    year,
    hourlyBalanceTAS: {
      id: faker.datatype.uuid(),
      working,
      nonWorking,
      simple,
      hourlyBalanceId: id,
    },
    actualBalanceId,
  };

  return result;
}
