import { CalculationTAS } from "@/@types/calculations";
import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import faker from "@faker-js/faker";
import {
  ActualBalance,
  Contract,
  Month,
  TypeOfOfficials,
} from "@prisma/client";
import Decimal from "decimal.js";
import { DateTime } from "luxon";
import CalculateForTAS from "services/calculations/classes/CalculateForTAS";
import { getMonthByNumber } from "utils/mapMonths";

const getBalance = jest.fn();
const get = jest.fn();

type Total = {
  simple: Decimal;
  nonWorking: Decimal;
  working: Decimal;
  totalHours: Decimal;
  discount: Decimal;
};

type Data = {
  actualDate: Date;
  calculations: CalculationTAS[];
  official: {
    id: number;
    recordNumber: number;
    firstName: string;
    lastName: string;
    position: string;
    contract: Contract;
    type: TypeOfOfficials;
    dateOfEntry: Date;
    chargeNumber: number;
  };
  year: number;
};

interface Result {
  data: Data;
  lastBalances: HourlyBalanceTAS[];
}

function hoursToSeconds(hours) {
  return BigInt(hours) * 60n * 60n;
}

const date = DateTime.fromObject({
  year: 2021,
  month: 2,
  day: 25,
}).toJSDate();
const year = date.getFullYear();

const actualBalance: ActualBalance = {
  id: faker.datatype.uuid(),
  officialId: 1,
  year,
  total: 0n,
};

const calculations: CalculationTAS[] = [
  buildCalculation({
    year,
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
    year,
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
    year,
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

describe("Test calculations", () => {
  beforeEach(() => {
    getBalance.mockReset();
  });

  test("Should calculate right the passed values", async () => {
    get.mockResolvedValue([]);
    let data = await preset(calculations, year, date);
    let total = calculate(calculations, data.lastBalances);
    await testGeneral(data, total);
    get.mockReset();

    const otherCalculations: CalculationTAS[] = [
      buildCalculation({
        year,
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
        year,
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
        year,
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
        year,
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

    get.mockResolvedValue(
      calculations.map((c) => ({ ...c, month: getMonthByNumber(c.month) }))
    );
    data = await preset(otherCalculations, year, date);
    total = calculate(
      [...calculations, ...otherCalculations],
      data.lastBalances
    );
    await testGeneral(data, {
      total: total.total,
      totalCurrentYear: total.totalCurrentYear,
    });
  });

  async function preset(
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

  async function testGeneral(
    { lastBalances, data }: Result,
    {
      totalCurrentYear,
      total,
    }: { totalCurrentYear: Omit<Total, "totalHours">; total: Total }
  ) {
    getBalance.mockResolvedValue(lastBalances);

    const calculator = new CalculateForTAS({ getBalance, get });

    try {
      const response = await calculator.calculate({
        ...data,
        hourlyBalances: [...lastBalances],
      });

      expect(response.simpleHours.value).toBe(totalCurrentYear.simple);
      expect(
        totalCurrentYear.working.equals(response.workingHours.value)
      ).toBeTruthy();
      expect(
        totalCurrentYear.nonWorking.equals(response.nonWorkingHours.value)
      ).toBeTruthy();
      expect(response.totalBalance).toBe(total.totalHours);
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  function calculate(calculations, lastBalances) {
    const totalCurrentYear: Omit<Total, "totalHours"> = {
      simple: new Decimal(0),
      working: new Decimal(0),
      nonWorking: new Decimal(0),
      discount: new Decimal(0),
    };
    calculations.forEach((calculation) => {
      totalCurrentYear.simple.add(calculation.surplusSimple);
      totalCurrentYear.working.add(calculation.surplusBusiness);
      totalCurrentYear.nonWorking.add(calculation.surplusNonWorking);
      totalCurrentYear.discount.add(calculation.discount);
    });

    totalCurrentYear.working = new Decimal(
      totalCurrentYear.working.toString()
    ).mul(1.5);
    totalCurrentYear.nonWorking = new Decimal(
      totalCurrentYear.nonWorking.toString()
    ).mul(2);

    const total: Total = {
      ...totalCurrentYear,
      totalHours: new Decimal(0),
    };

    lastBalances.forEach((balance) => {
      total.simple = new Decimal(balance.simple).add(total.simple);
      total.working = new Decimal(balance.working.toString()).add(
        total.working
      );
      total.nonWorking = new Decimal(balance.nonWorking.toString()).add(
        total.nonWorking
      );
    });

    total.totalHours = new Decimal(total.working.toString())
      .add(total.nonWorking.toString())
      .add(total.simple.toString())
      .sub(total.discount.toString());

    console.log("totalHours:", total.totalHours);

    return { totalCurrentYear, total };
  }
});

function buildCalculation(
  calculation: Omit<CalculationTAS, "id" | "calculationId">
): CalculationTAS {
  const calculationId = faker.datatype.uuid();
  return {
    id: faker.datatype.uuid(),
    ...calculation,
    calculationId,
  };
}

function buildHourlyBalance({
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
