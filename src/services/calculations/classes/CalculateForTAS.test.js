import faker from "@faker-js/faker";
import { Contract, TypeOfOfficials } from "@prisma/client";
import luxon from "luxon";
import CalculateForTAS from "services/calculations/classes/CalculateForTAS";

const getBalance = jest.fn();

function hoursToSeconds(seconds) {
  return seconds * 60 * 60;
}

describe("Test calculations", () => {
  beforeEach(() => {
    getBalance.mockReset();
  });

  test("Should calculate right the passed values", async () => {
    const date = luxon.DateTime.fromObject({
      year: 2021,
      month: 2,
      day: 25,
    }).toJSDate();
    const year = date.getFullYear();
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
          surplusBusiness: 4n,
          surplusNonWorking: 2n,
          surplusSimple: 1n,
          discount: 3n,
          workingOvertime: hoursToSeconds(5),
          workingNightOvertime: 0,
          nonWorkingOvertime: 0,
          nonWorkingNightOvertime: hoursToSeconds(1),
        },
      ],
      official: {
        id: 1,
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
        dateOfEntry: faker.date.past(1, "2018-04-01T00:00.000Z"),
        chargeNumber: faker.datatype.number(),
      },
      year,
    };

    getBalance.mockResolvedValue();
    const calculator = new CalculateForTAS({ getBalance });
    calculator.calculate(data);
  });
});
