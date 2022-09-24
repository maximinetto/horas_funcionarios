import faker from "@faker-js/faker";
import _omit from "lodash/omit";

import OfficialConverter from "../../../../converters/models_to_entities/OfficialConverter";
import MikroORMActualBalanceBuilder from "../../../../creators/actual/MikroORMActualBalanceBuilder";
import MikroORMOfficialBuilder from "../../../../creators/official/MikroORMOfficialBuilder";
import { Contract, TypeOfOfficial } from "../../../../enums/officials";
import OfficialService from "../../../../services/officials";
import { unitOfWork } from "../../../../setupIntegrationTestEnvironment";
import { OfficialWithOptionalId } from "../../../../types/officials";

let officials: OfficialWithOptionalId[];
let officialService: OfficialService;
let officialConverter: OfficialConverter;

beforeEach(() => {
  officialConverter = new OfficialConverter({
    officialBuilder: new MikroORMOfficialBuilder({
      actualHourlyBalanceBuilder: new MikroORMActualBalanceBuilder(),
    }),
  });
  officialService = new OfficialService({
    officialRepository: unitOfWork.official,
    officialConverter,
  });
  return createFakeOfficials().then((value) => {
    officials = value;
    console.log("officials.integration.test");
  });
});

test("Should get all instance of officials", async () => {
  console.log("Should get all instance of officials");
  const response = await officialService.get({});

  const result = (res: OfficialWithOptionalId) =>
    _omit(res, ["id", "actualBalances", "createdAt", "updatedAt"]);

  console.log("result:", result);

  expect(response.length).toBe(2);
  expect(response.map(result)).toEqual(officials);

  const response2 = await officialService.get({
    contract: Contract.PERMANENT,
  });

  expect(response2.map(result)).toEqual(
    officials.filter(({ contract }) => contract === Contract.PERMANENT)
  );

  const response3 = await officialService.get({
    type: TypeOfOfficial.TEACHER,
  });

  expect(response3.map(result)).toEqual(
    officials.filter(({ type }) => type === TypeOfOfficial.TEACHER)
  );

  const response4 = await officialService.get({
    type: TypeOfOfficial.TAS,
  });

  expect(response4.map(result)).toEqual(
    officials.filter(({ type }) => type === TypeOfOfficial.TAS)
  );

  const response5 = await officialService.get({
    year: 2018,
  });

  expect(response5.map(result)).toEqual(
    officials.filter(({ dateOfEntry }) => dateOfEntry.getFullYear() === 2018)
  );
});

test("Should create 1 official", async () => {
  console.log("Should create 1 official");

  const official = {
    recordNumber: faker.datatype.number(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    position: faker.name.jobTitle(),
    dateOfEntry: new Date("2020-01-01"),
    chargeNumber: faker.datatype.number(),
    type: faker.random.arrayElement([
      TypeOfOfficial.TEACHER,
      TypeOfOfficial.TAS,
    ]),
    contract: faker.random.arrayElement([
      Contract.PERMANENT,
      Contract.TEMPORARY,
    ]),
  };

  const officialEntity = officialConverter.fromModelToEntity(official);

  const response = await officialService.create(officialEntity);
  const officialWithoutId = { ...response, id: undefined };

  delete officialWithoutId.id;

  expect(officialWithoutId).toEqual(official);
});

test("Should update the existing official", async () => {
  console.log("Should update the existing official");
  const official = {
    recordNumber: faker.datatype.number(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    position: faker.name.jobTitle(),
    dateOfEntry: new Date("2020-01-01"),
    chargeNumber: faker.datatype.number(),
    type: faker.random.arrayElement([
      TypeOfOfficial.TEACHER,
      TypeOfOfficial.TAS,
    ]),
    contract: faker.random.arrayElement([
      Contract.PERMANENT,
      Contract.TEMPORARY,
    ]),
  };

  const officialUpdated: typeof official = {
    ...official,
    position: "Informática",
    firstName: "Pepe",
    lastName: "Argento",
  };

  const initialOfficial = officialConverter.fromModelToEntity(official);

  await unitOfWork.official.add(initialOfficial);
  await unitOfWork.commit();

  const optionalOfficialFetched = await unitOfWork.official.getLast();

  if (!optionalOfficialFetched.isPresent()) {
    throw new Error("No official found");
  }

  const officialFetched = optionalOfficialFetched.get();
  const officialEntityUpdated =
    officialConverter.fromModelToEntity(officialUpdated);

  officialEntityUpdated.id = officialFetched.id;

  const result = await officialService.update(officialEntityUpdated);

  expect(result).toEqual({ ...officialUpdated, id: officialFetched.id });
});

test("Should delete a existing official record", async () => {
  console.log("Should delete a existing official record");

  const officialOptional = await unitOfWork.official.getLast();

  if (!officialOptional) {
    throw new Error("No official found");
  }

  const officialFetched = officialOptional.get();

  const result = await officialService.delete(officialFetched.id);

  const officialModel = officialConverter.fromEntityToModel(officialFetched);

  const expected = _omit(officialModel, [
    "actualBalances",
    "createdAt",
    "updatedAt",
  ]);

  expect(result).toEqual(expected);

  const count = await unitOfWork.official.count();

  expect(count).toBe(1);
});

async function createFakeOfficials(): Promise<OfficialWithOptionalId[]> {
  const _officials = [
    {
      recordNumber: faker.datatype.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      position: faker.name.jobTitle(),
      dateOfEntry: new Date("2020-01-01"),
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
      recordNumber: faker.datatype.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      position: faker.name.jobTitle(),
      dateOfEntry: new Date("2018-03-04"),
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

  const entities = officialConverter.fromModelsToEntities(_officials);
  await unitOfWork.official.addRange(entities);
  await unitOfWork.commit();
  return _officials;
}
