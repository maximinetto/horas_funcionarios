import { CalculationTAS } from "@/@types/calculations";
import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import faker from "@faker-js/faker";

export function buildCalculation(
  calculation: Omit<CalculationTAS, "id" | "calculationId">
): CalculationTAS {
  const calculationId = faker.datatype.uuid();
  return {
    id: faker.datatype.uuid(),
    ...calculation,
    calculationId,
  };
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
  const result: HourlyBalanceTAS = {
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
