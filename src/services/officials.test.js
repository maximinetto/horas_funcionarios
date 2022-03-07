// import { faker } from "@faker-js/faker";
import { TypeOfOfficials, Contract } from "@prisma/client";
import { mockReset } from "jest-mock-extended";
import faker from "@faker-js/faker";
import { prismaMock } from "singleton";

describe("Officials controller tests", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  test("Should get multiples official models", async () => {
    const service = require("./officials").default;
    const officials = [
      {
        recordNumber: faker.datatype.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        position: faker.name.jobTitle(),
        dateOfEntry: faker.date.past(),
        chargeNumber: faker.datatype.number(),
        type: faker.random.arrayElement([
          TypeOfOfficials.TEACHER,
          TypeOfOfficials.NOT_TEACHER,
        ]),
        contract: faker.random.arrayElement([
          Contract.PERMANENT,
          Contract.TEMPORARY,
        ]),
      },
      {
        recordNumber: faker.datatype.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        position: faker.name.jobTitle(),
        dateOfEntry: faker.date.past(),
        chargeNumber: faker.datatype.number(),
        type: faker.random.arrayElement([
          TypeOfOfficials.TEACHER,
          TypeOfOfficials.NOT_TEACHER,
        ]),
        contract: faker.random.arrayElement([
          Contract.PERMANENT,
          Contract.TEMPORARY,
        ]),
      },
    ];

    prismaMock.official.findMany.mockResolvedValue(officials);

    const result = await service.get({});
    expect(result).toEqual(officials);
  });

  test("Should filter officials", async () => {
    const service = require("./officials").default;
    const date = faker.date.past();
    const year = date.getFullYear();
    const officials = [
      {
        recordNumber: faker.datatype.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        position: faker.name.jobTitle(),
        dateOfEntry: faker.date.past(),
        chargeNumber: faker.datatype.number(),
        type: faker.random.arrayElement([
          TypeOfOfficials.TEACHER,
          TypeOfOfficials.NOT_TEACHER,
        ]),
        contract: faker.random.arrayElement([
          Contract.PERMANENT,
          Contract.TEMPORARY,
        ]),
      },
      {
        recordNumber: faker.datatype.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        position: faker.name.jobTitle(),
        dateOfEntry: date,
        chargeNumber: faker.datatype.number(),
        type: faker.random.arrayElement([
          TypeOfOfficials.TEACHER,
          TypeOfOfficials.NOT_TEACHER,
        ]),
        contract: faker.random.arrayElement([
          Contract.PERMANENT,
          Contract.TEMPORARY,
        ]),
      },
    ];

    const mockYear = officials.find(
      (official) => official.dateOfEntry.getFullYear() === year
    );

    const mockContract = officials.find(
      (official) => official.contract === Contract.PERMANENT
    );

    prismaMock.official.findMany.mockResolvedValue(mockYear);

    const result = await service.get({ year });
    expect(result).toEqual(mockYear);

    prismaMock.official.findMany.mockResolvedValue(mockContract);

    const result2 = await service.get({ contract: Contract.PERMANENT });
    expect(result2).toEqual(mockContract);
  });

  test("Should create a new official", async () => {
    const service = require("services/officials").default;
    const official = {
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    };

    prismaMock.official.create.mockResolvedValue(official);

    await expect(service.create(official)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    });
  });

  test("Should update an existing official record", async () => {
    const service = require("services/officials").default;
    const official = {
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    };

    prismaMock.official.update.mockResolvedValue(official);

    await expect(service.update(official.id, official)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    });
  });

  test("Should delete a official record", async () => {
    const service = require("services/officials").default;
    const official = {
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    };

    prismaMock.official.delete.mockResolvedValue(official);

    await expect(service.delete(official.id)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    });

    expect(prismaMock.official.delete).toHaveBeenCalledWith({
      where: { id: official.id },
    });

    expect(prismaMock.official.delete).toHaveBeenCalledTimes(1);
  });
});
