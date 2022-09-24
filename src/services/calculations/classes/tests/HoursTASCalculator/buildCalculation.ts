import faker from "@faker-js/faker";
import { Decimal } from "decimal.js";

import ActualBalanceTAS from "../../../../../entities/ActualBalanceTAS";
import CalculationTAS from "../../../../../entities/CalculationTAS";
import HourlyBalanceTAS from "../../../../../entities/HourlyBalanceTAS";
import { CalculationTAS as CalculationTASModel } from "../../../../../types/calculations";

export function buildCalculation(
  calculation: Omit<CalculationTASModel, "id" | "calculationId">
): CalculationTAS {
  const id = faker.datatype.uuid();
  return new CalculationTAS({
    id,
    year: calculation.year,
    month: calculation.month,
    surplusBusiness: new Decimal(calculation.surplusBusiness.toString()),
    surplusNonWorking: new Decimal(calculation.surplusNonWorking.toString()),
    surplusSimple: new Decimal(calculation.surplusSimple.toString()),
    discount: new Decimal(calculation.discount.toString()),
    workingOvertime: new Decimal(calculation.workingOvertime.toString()),
    workingNightOvertime: new Decimal(
      calculation.workingNightOvertime.toString()
    ),
    nonWorkingOvertime: new Decimal(calculation.nonWorkingOvertime.toString()),
    nonWorkingNightOvertime: new Decimal(
      calculation.nonWorkingNightOvertime.toString()
    ),
    compensatedNightOvertime: new Decimal(
      calculation.compensatedNightOvertime.toString()
    ),
    observations: calculation.observations ?? undefined,
    actualBalance: new ActualBalanceTAS({
      id: calculation.actualBalanceId,
      year: calculation.year,
    }),
  });
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

  return new HourlyBalanceTAS({
    id,
    year,
    working: new Decimal(working.toString()),
    nonWorking: new Decimal(nonWorking.toString()),
    simple: new Decimal(simple.toString()),
    actualBalance: new ActualBalanceTAS({
      id: actualBalanceId,
      year,
    }),
  });
}
