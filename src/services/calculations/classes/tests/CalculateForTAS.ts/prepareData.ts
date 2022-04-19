import { CalculationTAS } from "@/@types/calculations";
import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import faker from "@faker-js/faker";
import { Contract, TypeOfOfficials } from "@prisma/client";
import { buildHourlyBalance } from "./buildCalculation";
import { actualBalance } from "./initialValues";
import { Result } from "./types";
import { hoursToSeconds } from "./util";

export async function preset(
  calculations: CalculationTAS[],
  year: number,
  date: Date
): Promise<Result> {
  const data = {
    actualDate: date,
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

  const lastBalances: HourlyBalanceTAS[] = [
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
