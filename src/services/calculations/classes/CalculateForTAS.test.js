import faker from "@faker-js/faker";
import { Contract, TypeOfOfficials } from "@prisma/client";
import Decimal from "decimal.js";
import { DateTime } from "luxon";
import CalculateForTAS from "services/calculations/classes/CalculateForTAS";

const getBalance = jest.fn();
const get = jest.fn();

function hoursToSeconds(hours) {
  return BigInt(hours) * 60n * 60n;
}

describe("Test calculations", () => {
  beforeEach(() => {
    getBalance.mockReset();
  });

  test("Should calculate right the passed values", async () => {
    const date = DateTime.fromObject({
      year: 2021,
      month: 2,
      day: 25,
    }).toJSDate();
    const year = date.getFullYear();
    const officialId = 1;
    const data = {
      actualDate: date,
      calculations: [
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
      ],
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

    const totalCurrentYear = {
      simple: 0n,
      working: 0n,
      nonWorking: 0n,
    };
    data.calculations.forEach((calculation) => {
      totalCurrentYear.simple += calculation.surplusSimple;
      totalCurrentYear.working += calculation.surplusBusiness;
      totalCurrentYear.nonWorking += calculation.surplusNonWorking;
    });

    totalCurrentYear.working = new Decimal(
      totalCurrentYear.working.toString()
    ).mul(1.5);
    totalCurrentYear.nonWorking = new Decimal(
      totalCurrentYear.nonWorking.toString()
    ).mul(2);

    const total = { ...totalCurrentYear };
    total.working = new Decimal(total.working.toString()).mul(1.5);
    total.nonWorking = new Decimal(total.nonWorking.toString()).mul(2);

    lastBalances.forEach((balance) => {
      total.simple += balance.simple;
      total.working = new Decimal(balance.working.toString()).add(
        total.working
      );
      total.nonWorking = new Decimal(balance.nonWorking.toString()).add(
        total.nonWorking
      );
    });

    console.log(total);

    getBalance.mockResolvedValue(lastBalances);
    get.mockResolvedValue([]);
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
      expect(response.totalBalance).toBe(hoursToSeconds(152) + 6n * 60n);
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  });
});
