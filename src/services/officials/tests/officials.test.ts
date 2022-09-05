import { faker } from "@faker-js/faker";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import MikroORMActualBalanceBuilder from "creators/actual/MikroORMActualBalanceBuilder";
import MikroORMOfficialBuilder from "creators/official/MikroORMOfficialBuilder";
import OfficialBuilder from "creators/official/OfficialBuilder";
import Official, { Contract, TypeOfOfficial } from "entities/Official";
import { DateTime } from "luxon";
import OfficialRepository from "persistence/Official/OfficialRepository";
import { Optional } from "typescript-optional";

import OfficialService from "..";

describe("Officials controller tests", () => {
  let officialService: OfficialService;
  let officialRepository: jest.Mocked<OfficialRepository>;
  let officialConverter: OfficialConverter;
  let officialBuilder: OfficialBuilder;

  beforeAll(() => {
    officialConverter = new OfficialConverter({
      officialBuilder: new MikroORMOfficialBuilder({
        actualHourlyBalanceBuilder: new MikroORMActualBalanceBuilder(),
      }),
    });
    officialBuilder = new MikroORMOfficialBuilder({
      actualHourlyBalanceBuilder: new MikroORMActualBalanceBuilder(),
    });
    officialRepository = {
      add: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      filter: jest.fn(),
      addRange: jest.fn(),
      setRange: jest.fn(),
      removeRange: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      clear: jest.fn(),
      getLast: jest.fn(),
      count: jest.fn(),
    };

    officialService = new OfficialService({
      officialConverter,
      officialRepository,
    });
  });

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
          TypeOfOfficial.TEACHER,
          TypeOfOfficial.TAS,
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
          TypeOfOfficial.TEACHER,
          TypeOfOfficial.TAS,
        ]),
        contract: faker.random.arrayElement([
          Contract.PERMANENT,
          Contract.TEMPORARY,
        ]),
      },
    ];

    officialRepository.filter.mockResolvedValue(
      officialConverter.fromModelsToEntities(officials)
    );

    const result = await officialService.get();
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
          TypeOfOfficial.TEACHER,
          TypeOfOfficial.TAS,
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
          TypeOfOfficial.TEACHER,
          TypeOfOfficial.TAS,
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

    officialRepository.filter.mockResolvedValue(
      officialConverter.fromModelsToEntities(mockOfficialByYear)
    );

    const result = await officialService.get({ year });
    expect(result).toEqual(mockOfficialByYear);

    officialRepository.filter.mockResolvedValue(
      officialConverter.fromModelsToEntities(mockContract)
    );

    // prismaMock.official.findMany.mockResolvedValue(mockContract);

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
      type: TypeOfOfficial.TEACHER,
      contract: Contract.PERMANENT,
    };

    const officialEntity = officialConverter.fromModelToEntity(official);

    officialRepository.add.mockResolvedValue(officialEntity);

    await expect(officialService.create(officialEntity)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: TypeOfOfficial.TEACHER,
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
      type: TypeOfOfficial.TEACHER,
      contract: Contract.PERMANENT,
    };

    const officialEntity = officialConverter.fromModelToEntity(official);

    officialRepository.get.mockResolvedValue(Optional.of(officialEntity));

    const officialEntityUpdated = new Official({
      ...officialEntity,
      actualBalances: undefined,
      position: "Asistente Informática",
      type: TypeOfOfficial.TAS,
    });

    officialRepository.set.mockResolvedValue(officialEntityUpdated);

    await expect(
      officialService.update(officialEntityUpdated)
    ).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Asistente Informática",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: TypeOfOfficial.TAS,
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
      type: TypeOfOfficial.TEACHER,
      contract: Contract.PERMANENT,
      createdAt: undefined,
      updatedAt: undefined,
    };

    const officialEntity = officialBuilder.create({
      ...official,
      dateOfEntry: DateTime.fromJSDate(official.dateOfEntry),
    });

    officialRepository.get.mockResolvedValue(Optional.of(officialEntity));
    officialRepository.remove.mockResolvedValue(officialEntity);

    await expect(officialService.delete(official.id)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: TypeOfOfficial.TEACHER,
      contract: Contract.PERMANENT,
    });

    expect(officialRepository.remove).toHaveBeenCalledWith(officialEntity);

    expect(officialRepository.remove).toHaveBeenCalledTimes(1);
  });
});
