import faker from "@faker-js/faker";
import { Contract, TypeOfOfficials } from "@prisma/client";
import Decimal from "decimal.js";
import { DateTime } from "luxon";
import CalculateForTAS from "services/calculations/classes/CalculateForTAS";
import { getMonthByNumber } from "utils/mapMonths";

const getBalance = jest.fn();
const get = jest.fn();

function hoursToSeconds(hours) {
  return BigInt(hours) * 60n * 60n;
}

const date = DateTime.fromObject({
  year: 2021,
  month: 2,
  day: 25,
}).toJSDate();
const year = date.getFullYear();

const calculations = [
  {
    id: faker.datatype.uuid(),
    year,
    month: 1,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: 0n,
    discount: 0n,
    workingOvertime: hoursToSeconds(19),
    workingNightOvertime: 0,
    nonWorkingOvertime: 0,
    nonWorkingNightOvertime: hoursToSeconds(2),
  },
  {
    id: faker.datatype.uuid(),
    year,
    month: 2,
    observations: "",
    surplusBusiness: hoursToSeconds(4) + 47n * 60n,
    surplusNonWorking: hoursToSeconds(2) + 33n * 60n,
    surplusSimple: hoursToSeconds(1) + 23n * 60n,
    discount: hoursToSeconds(2) + 33n * 60n,
    workingOvertime: hoursToSeconds(5),
    workingNightOvertime: 0,
    nonWorkingOvertime: 0,
    nonWorkingNightOvertime: hoursToSeconds(1),
  },
  {
    id: faker.datatype.uuid(),
    year,
    month: 3,
    observations: "",
    surplusBusiness: hoursToSeconds(1) + 17n * 60n,
    surplusNonWorking: hoursToSeconds(3) + 29n * 60n,
    surplusSimple: hoursToSeconds(7) + 38n * 60n,
    discount: hoursToSeconds(4) + 22n * 60n,
    workingOvertime: hoursToSeconds(13),
    workingNightOvertime: 0,
    nonWorkingOvertime: 0,
    nonWorkingNightOvertime: hoursToSeconds(3),
  },
];

describe("Test calculations", () => {
  beforeEach(() => {
    getBalance.mockReset();
  });

  test("Should calculate right the passed values", async () => {
    get.mockResolvedValue([]);
    let data = await preset(calculations, year, date);
    let total = calculate(calculations, data.lastBalances);
    await testGeneral(data, total, hoursToSeconds(152) + 6n * 60n);
    get.mockReset();

    const otherCalculations = [
      {
        id: faker.datatype.uuid(),
        year,
        month: 4,
        observations: "Pepe",
        surplusBusiness: hoursToSeconds(12) + 13n * 60n,
        surplusNonWorking: 0n,
        surplusSimple: 0n,
        discount: 0n,
        workingOvertime: hoursToSeconds(1) + 17n * 60n,
        workingNightOvertime: 0n,
        nonWorkingOvertime: 0n,
        nonWorkingNightOvertime: hoursToSeconds(1),
      },
      {
        id: faker.datatype.uuid(),
        year,
        month: 5,
        observations: "",
        surplusBusiness: 0n,
        surplusNonWorking: hoursToSeconds(1) + 47n * 60n,
        surplusSimple: hoursToSeconds(7) + 39n * 60n,
        discount: hoursToSeconds(2) + 2n * 60n,
        workingOvertime: 0n,
        workingNightOvertime: 0n,
        nonWorkingOvertime: 0n,
        nonWorkingNightOvertime: 0n,
      },
      {
        id: faker.datatype.uuid(),
        year,
        month: 6,
        observations: "",
        surplusBusiness: 0n,
        surplusNonWorking: 0n,
        surplusSimple: hoursToSeconds(3) + 1n * 60n,
        discount: hoursToSeconds(1) + 1n * 60n,
        workingOvertime: 0n,
        workingNightOvertime: 0n,
        nonWorkingOvertime: 0n,
        nonWorkingNightOvertime: 0n,
      },
      {
        id: faker.datatype.uuid(),
        year,
        month: 7,
        observations: "",
        surplusBusiness: 0n,
        surplusNonWorking: 0n,
        surplusSimple: hoursToSeconds(4) + 56n * 60n,
        discount: 0n,
        workingOvertime: 0n,
        workingNightOvertime: 0n,
        nonWorkingOvertime: 0n,
        nonWorkingNightOvertime: 0n,
      },
    ];

    get.mockResolvedValue(
      calculations.map((c) => ({ ...c, month: getMonthByNumber(c.month) }))
    );
    data = await preset(otherCalculations, year, date);
    total = calculate(
      [...calculations, ...otherCalculations],
      data.lastBalances
    );
    await testGeneral(data, total, hoursToSeconds(186) + 33n * 60n);
  });

  async function preset(calculations, year, date) {
    const officialId = 1;
    const data = {
      actualDate: date,
      calculations: calculations,
      official: {
        id: officialId,
        recordNumber: faker.datatype.number(),
        firstName: faker.name.firstName,
        lastName: faker.name.lastName,
        position: faker.name.jobTitle,
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

    const lastBalances = [
      {
        id: faker.datatype.uuid(),
        year: 2017,
        yearBalance: year,
        working: hoursToSeconds(9) + 17n * 60n,
        nonWorking: 0n,
        simple: hoursToSeconds(3),
        officialId: 1,
      },
      {
        id: faker.datatype.uuid(),
        year: 2018,
        yearBalance: year,
        working: hoursToSeconds(11) + 37n * 60n,
        nonWorking: hoursToSeconds(6) + 55n * 60n,
        simple: hoursToSeconds(8) + 2n * 60n,
        officialId: 1,
      },
      {
        id: faker.datatype.uuid(),
        year: 2019,
        yearBalance: year,
        working: hoursToSeconds(30) + 5n * 60n,
        nonWorking: hoursToSeconds(10) + 2n * 60n,
        simple: hoursToSeconds(20),
        officialId: 1,
      },
      {
        id: faker.datatype.uuid(),
        year: 2020,
        yearBalance: year,
        working: hoursToSeconds(13) + 15n * 60n,
        nonWorking: hoursToSeconds(11) + 2n * 60n,
        simple: hoursToSeconds(5) + 35n * 60n,
        officialId: 1,
      },
    ];

    return { data, lastBalances };
  }

  async function testGeneral(
    { lastBalances, data },
    { totalCurrentYear, total }
  ) {
    getBalance.mockResolvedValue(lastBalances);

    const calculator = new CalculateForTAS({ getBalance, get });

    try {
      const response = await calculator.calculate(data);

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
    const totalCurrentYear = {
      simple: 0n,
      working: 0n,
      nonWorking: 0n,
      discount: 0n,
    };
    calculations.forEach((calculation) => {
      totalCurrentYear.simple += calculation.surplusSimple;
      totalCurrentYear.working += calculation.surplusBusiness;
      totalCurrentYear.nonWorking += calculation.surplusNonWorking;
      totalCurrentYear.discount += calculation.discount;
    });

    totalCurrentYear.working = new Decimal(
      totalCurrentYear.working.toString()
    ).mul(1.5);
    totalCurrentYear.nonWorking = new Decimal(
      totalCurrentYear.nonWorking.toString()
    ).mul(2);

    const total = { ...totalCurrentYear };

    lastBalances.forEach((balance) => {
      total.simple += balance.simple;
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

    total.totalHours = !total.totalHours.isInteger()
      ? total.totalHours
      : BigInt(total.totalHours.toString());

    console.log("totalHours:", total.totalHours);

    return { totalCurrentYear, total };
  }
});
