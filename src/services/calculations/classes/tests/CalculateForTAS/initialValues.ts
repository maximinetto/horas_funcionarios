import { CalculationTAS } from "@/@types/calculations";
import faker from "@faker-js/faker";
import { ActualBalance, Month } from "@prisma/client";
import { DateTime } from "luxon";
import { buildCalculation } from "./buildCalculation";
import { hoursToSeconds } from "./util";

export const dateFirstTest = DateTime.fromObject({
  year: 2021,
  month: 2,
  day: 25,
}).toJSDate();
export const yearFirstTest = dateFirstTest.getFullYear();

export const actualBalance: ActualBalance = {
  id: faker.datatype.uuid(),
  officialId: 1,
  year: yearFirstTest,
  total: 0n,
};

export const calculationsFirstTest: CalculationTAS[] = [
  buildCalculation({
    year: yearFirstTest,
    month: Month.JANUARY,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: 0n,
    discount: 0n,
    workingOvertime: hoursToSeconds(19),
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(2),
    compensatedNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
  }),
  buildCalculation({
    year: yearFirstTest,
    month: Month.FEBRUARY,
    observations: "",
    surplusBusiness: hoursToSeconds(4) + 47n * 60n,
    surplusNonWorking: hoursToSeconds(2) + 33n * 60n,
    surplusSimple: hoursToSeconds(1) + 23n * 60n,
    discount: hoursToSeconds(2) + 33n * 60n,
    workingOvertime: hoursToSeconds(5),
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(1),
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearFirstTest,
    month: Month.MARCH,
    observations: "",
    surplusBusiness: hoursToSeconds(1) + 17n * 60n,
    surplusNonWorking: hoursToSeconds(3) + 29n * 60n,
    surplusSimple: hoursToSeconds(7) + 38n * 60n,
    discount: hoursToSeconds(4) + 22n * 60n,
    workingOvertime: hoursToSeconds(13),
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(3),
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
];

export const otherCalculations: CalculationTAS[] = [
  buildCalculation({
    year: yearFirstTest,
    month: Month.APRIL,
    observations: "Pepe",
    surplusBusiness: hoursToSeconds(12) + 13n * 60n,
    surplusNonWorking: 0n,
    surplusSimple: 0n,
    discount: 0n,
    workingOvertime: hoursToSeconds(1) + 17n * 60n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(1),
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearFirstTest,
    month: Month.MAY,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: hoursToSeconds(1) + 47n * 60n,
    surplusSimple: hoursToSeconds(7) + 39n * 60n,
    discount: hoursToSeconds(2) + 2n * 60n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearFirstTest,
    month: Month.JUNE,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: hoursToSeconds(3) + 1n * 60n,
    discount: hoursToSeconds(1) + 1n * 60n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearFirstTest,
    month: Month.JULY,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: hoursToSeconds(4) + 56n * 60n,
    discount: 0n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
];

export const dateSecondTest = DateTime.fromObject({
  year: 2019,
  month: 12,
  day: 10,
}).toJSDate();

export const yearSecondTest = dateSecondTest.getFullYear();

export const calculationsSecondTest: CalculationTAS[] = [
  buildCalculation({
    year: yearSecondTest,
    month: Month.JANUARY,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: 0n,
    discount: 0n,
    workingOvertime: hoursToSeconds(19),
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(2),
    compensatedNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.FEBRUARY,
    observations: "",
    surplusBusiness: hoursToSeconds(4) + 47n * 60n,
    surplusNonWorking: hoursToSeconds(2) + 33n * 60n,
    surplusSimple: hoursToSeconds(1) + 23n * 60n,
    discount: hoursToSeconds(2) + 33n * 60n,
    workingOvertime: hoursToSeconds(5),
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(1),
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.MARCH,
    observations: "",
    surplusBusiness: hoursToSeconds(1) + 17n * 60n,
    surplusNonWorking: hoursToSeconds(3) + 29n * 60n,
    surplusSimple: hoursToSeconds(7) + 38n * 60n,
    discount: hoursToSeconds(4) + 22n * 60n,
    workingOvertime: hoursToSeconds(13),
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(3),
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.APRIL,
    observations: "Pepe",
    surplusBusiness: hoursToSeconds(12) + 13n * 60n,
    surplusNonWorking: 0n,
    surplusSimple: 0n,
    discount: 0n,
    workingOvertime: hoursToSeconds(1) + 17n * 60n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(1),
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.MAY,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: hoursToSeconds(1) + 47n * 60n,
    surplusSimple: hoursToSeconds(7) + 39n * 60n,
    discount: hoursToSeconds(2) + 2n * 60n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.JUNE,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: hoursToSeconds(3) + 1n * 60n,
    discount: hoursToSeconds(1) + 1n * 60n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.JULY,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: hoursToSeconds(4) + 56n * 60n,
    discount: 0n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.AUGUST,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: hoursToSeconds(3) + 12n * 60n,
    surplusSimple: hoursToSeconds(4) + 37n * 60n,
    discount: hoursToSeconds(2) + 49n * 60n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.SEPTEMBER,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: hoursToSeconds(1) + 2n * 60n,
    discount: 0n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.OCTOBER,
    observations: "",
    surplusBusiness: hoursToSeconds(2) + 11n * 60n,
    surplusNonWorking: hoursToSeconds(0) + 43n * 60n,
    surplusSimple: hoursToSeconds(2) + 52n * 60n,
    discount: 0n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.NOVEMBER,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: hoursToSeconds(3) + 45n * 60n,
    discount: hoursToSeconds(1) + 2n * 60n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
  buildCalculation({
    year: yearSecondTest,
    month: Month.DECEMBER,
    observations: "",
    surplusBusiness: hoursToSeconds(2) + 13n * 60n,
    surplusNonWorking: 0n,
    surplusSimple: hoursToSeconds(4) + 56n * 60n,
    discount: 0n,
    workingOvertime: 0n,
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: 0n,
    actualBalanceId: actualBalance.id,
    compensatedNightOvertime: 0n,
  }),
];

export const actualBalanceSecondTest: ActualBalance = {
  id: faker.datatype.uuid(),
  officialId: 1,
  year: yearSecondTest,
  total: 0n,
};
