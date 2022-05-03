import { CalculationTAS } from "@/@types/calculations";
import { getMonthByNumber } from "@/utils/mapMonths";
import faker from "@faker-js/faker";
import { Contract, TypeOfOfficials } from "@prisma/client";
import { buildCalculation, buildHourlyBalance } from "./buildCalculation";
import { actualBalance } from "./initialValues";
import { HourlyBalanceTASNotNullable, Result } from "./types";
import { hoursToSeconds } from "./util";

export function preset(calculations: CalculationTAS[], year: number): Result {
  const data = {
    calculations,
    official: {
      id: actualBalance.officialId,
      recordNumber: faker.datatype.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      position: faker.name.jobTitle(),
      contract: faker.random.arrayElement([
        Contract.PERMANENT,
        Contract.TEMPORARY,
      ]),
      type: faker.random.arrayElement([
        TypeOfOfficials.TEACHER,
        TypeOfOfficials.NOT_TEACHER,
      ]),
      dateOfEntry: faker.date.past(1, "2018-04-01T00:00z"),
      chargeNumber: faker.datatype.number(),
    },
    year,
  };

  const lastBalances: HourlyBalanceTASNotNullable[] = [
    buildHourlyBalance({
      year: 2017,
      actualBalanceId: actualBalance.id,
      working: hoursToSeconds(9) + 17n * 60n,
      nonWorking: 0n,
      simple: hoursToSeconds(3),
    }),
    buildHourlyBalance({
      actualBalanceId: actualBalance.id,
      year: 2018,
      working: hoursToSeconds(11) + 37n * 60n,
      nonWorking: hoursToSeconds(6) + 55n * 60n,
      simple: hoursToSeconds(8) + 2n * 60n,
    }),
    buildHourlyBalance({
      actualBalanceId: actualBalance.id,
      year: 2019,
      working: hoursToSeconds(30) + 5n * 60n,
      nonWorking: hoursToSeconds(10) + 2n * 60n,
      simple: hoursToSeconds(20),
    }),
    buildHourlyBalance({
      actualBalanceId: actualBalance.id,
      year: 2020,
      working: hoursToSeconds(13) + 15n * 60n,
      nonWorking: hoursToSeconds(11) + 2n * 60n,
      simple: hoursToSeconds(5) + 35n * 60n,
    }),
  ];

  return { data, lastBalances };
}

export const buildOfficial = ({
  calculations,
  date,
  officialId,
  year,
}: {
  calculations: CalculationTAS[];
  date: Date;
  officialId: number;
  year: number;
}) => {
  return {
    actualDate: date,
    calculations,
    official: {
      id: officialId ?? faker.datatype.number(),
      recordNumber: faker.datatype.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      position: faker.name.jobTitle(),
      contract: faker.random.arrayElement([
        Contract.PERMANENT,
        Contract.TEMPORARY,
      ]),
      type: faker.random.arrayElement([
        TypeOfOfficials.TEACHER,
        TypeOfOfficials.NOT_TEACHER,
      ]),
      dateOfEntry: faker.date.past(1, "2018-04-01T00:00z"),
      chargeNumber: faker.datatype.number(),
    },
    year,
  };
};

export const genRandomCalculations = (
  year: number,
  actualBalanceId: string
): CalculationTAS[] =>
  Array.from({ length: 12 }).map((_, i) => {
    const month = getMonthByNumber(i + 1);
    const surplusBusiness = faker.datatype.number({ min: 0, max: 10 });
    const surplusNonWorking = faker.datatype.number({ min: 0, max: 5 });
    const surplusSimple = faker.datatype.number({ min: 0, max: 30 });
    const min = Math.min(surplusBusiness, surplusNonWorking, surplusSimple);
    const discount = faker.datatype.number({ min: 0, max: min });
    return buildCalculation({
      year,
      month,
      observations: "",
      surplusBusiness:
        hoursToSeconds(surplusBusiness) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
      surplusNonWorking:
        hoursToSeconds(surplusNonWorking) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
      surplusSimple:
        hoursToSeconds(surplusSimple) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
      discount:
        hoursToSeconds(discount) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
      workingOvertime:
        hoursToSeconds(faker.datatype.number({ min: 0, max: 30 })) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
      workingNightOvertime:
        hoursToSeconds(faker.datatype.number({ min: 0, max: 30 })) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
      nonWorkingOvertime:
        hoursToSeconds(faker.datatype.number({ min: 0, max: 30 })) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
      nonWorkingNightOvertime:
        hoursToSeconds(faker.datatype.number({ min: 0, max: 30 })) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
      actualBalanceId,
      compensatedNightOvertime:
        hoursToSeconds(faker.datatype.number({ min: 0, max: 30 })) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
    });
  });
