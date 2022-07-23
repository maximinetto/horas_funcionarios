import faker from "@faker-js/faker";
import { Contract, TypeOfOfficials } from "@prisma/client";
import Calculations from "collections/Calculations";
import CalculationTAS from "entities/CalculationTAS";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import Official from "entities/Official";
import { DateTime } from "luxon";
import { CalculationTAS as CalculationTASModel } from "types/calculations";
import { getMonthByNumber } from "utils/mapMonths";

import { buildCalculation, buildHourlyBalance } from "./buildCalculation";
import { actualBalance } from "./initialValues";
import { Data, Result } from "./types";
import { hoursToSeconds } from "./util";

export function preset(
  calculations: Calculations<CalculationTAS>,
  year: number
): Result {
  const data = {
    calculations,
    official: new Official(
      actualBalance.officialId,
      faker.datatype.number(),
      faker.name.firstName(),
      faker.name.lastName(),
      faker.name.jobTitle(),
      faker.random.arrayElement([Contract.PERMANENT, Contract.TEMPORARY]),
      faker.random.arrayElement([
        TypeOfOfficials.TEACHER,
        TypeOfOfficials.NOT_TEACHER,
      ]),
      DateTime.fromJSDate(faker.date.past(1, "2018-04-01T00:00z")),
      faker.datatype.number()
    ),
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
}): Data & { actualDate: Date } => {
  return {
    actualDate: date,
    calculations: new Calculations(...calculations),
    official: new Official(
      officialId ?? faker.datatype.number(),
      faker.datatype.number(),
      faker.name.firstName(),
      faker.name.lastName(),
      faker.name.jobTitle(),
      faker.random.arrayElement([Contract.PERMANENT, Contract.TEMPORARY]),
      faker.random.arrayElement([
        TypeOfOfficials.TEACHER,
        TypeOfOfficials.NOT_TEACHER,
      ]),
      DateTime.fromJSDate(faker.date.past(1, "2018-04-01T00:00z")),
      faker.datatype.number()
    ),
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
    const calculation = {
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
      compensatedNightOvertime:
        hoursToSeconds(faker.datatype.number({ min: 0, max: 30 })) +
        BigInt(faker.datatype.number({ min: 0, max: 59 })) * 60n,
      actualBalanceId,
    } as Omit<CalculationTASModel, "id" | "calculationId">;
    return buildCalculation(calculation);
  });
