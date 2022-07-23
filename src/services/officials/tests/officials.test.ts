import { faker } from "@faker-js/faker";
import { Contract, TypeOfOfficials } from "@prisma/client";

import { officialService } from "dependencies/container";
import { prismaMock } from "singleton";

describe("Officials controller tests", () => {
  test("Should get multiples official models", async () => {
    const officials = [
      {
        id: faker.datatype.number(),
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
        id: faker.datatype.number(),
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

    const result = await officialService.get({});
    expect(result).toEqual(officials);
  });

  test("Should filter officials", async () => {
    const date = faker.date.past();
    const year = date.getFullYear();
    const officials = [
      {
        id: faker.datatype.number(),
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
        id: faker.datatype.number(),
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

    const mockOfficialByYear = officials.filter(
      (official) => official.dateOfEntry.getFullYear() === year
    );

    const mockContract = officials.filter(
      (official) => official.contract === Contract.PERMANENT
    );

    prismaMock.official.findMany.mockResolvedValue(mockOfficialByYear);

    const result = await officialService.get({ year });
    expect(result).toEqual(mockOfficialByYear);

    prismaMock.official.findMany.mockResolvedValue(mockContract);

    const result2 = await officialService.get({ contract: Contract.PERMANENT });
    expect(result2).toEqual(mockContract);
  });

  test("Should create a new official", async () => {
    const official = {
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: TypeOfOfficials.TEACHER,
      contract: Contract.PERMANENT,
    };

    prismaMock.official.create.mockResolvedValue(official);

    await expect(officialService.create(official)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: TypeOfOfficials.TEACHER,
      contract: Contract.PERMANENT,
    });
  });

  test("Should update an existing official record", async () => {
    const official = {
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: TypeOfOfficials.TEACHER,
      contract: Contract.PERMANENT,
    };

    prismaMock.official.update.mockResolvedValue(official);

    await expect(
      officialService.update(official.id, official)
    ).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: TypeOfOfficials.TEACHER,
      contract: Contract.PERMANENT,
    });
  });

  test("Should delete a official record", async () => {
    const official = {
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: TypeOfOfficials.TEACHER,
      contract: Contract.PERMANENT,
    };

    prismaMock.official.delete.mockResolvedValue(official);

    await expect(officialService.delete(official.id)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: TypeOfOfficials.TEACHER,
      contract: Contract.PERMANENT,
    });

    expect(prismaMock.official.delete).toHaveBeenCalledWith({
      where: { id: official.id },
    });

    expect(prismaMock.official.delete).toHaveBeenCalledTimes(1);
  });
});
