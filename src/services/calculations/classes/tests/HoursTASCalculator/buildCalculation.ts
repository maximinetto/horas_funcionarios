import faker from "@faker-js/faker";
import { Decimal } from "decimal.js";

import { CalculationTAS as CalculationTASModel } from "@/@types/calculations";
import ActualBalance from "@/entities/ActualBalance";
import CalculationTAS from "@/entities/CalculationTAS";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
import { generateRandomUUIDV4 } from "@/utils/strings";

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
  actualBalanceId: string;
  nonWorking: bigint;
  simple: bigint;
  working: bigint;
}) {
  const id = faker.datatype.uuid();

  return new HourlyBalanceTAS(
    id,
    year,
    new Decimal(working.toString()),
    new Decimal(nonWorking.toString()),
    new Decimal(simple.toString()),
    generateRandomUUIDV4(),
    ActualBalance.default(actualBalanceId)
  );
}
