import faker from "@faker-js/faker";
import { Contract, TypeOfOfficials } from "@prisma/client";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import _omit from "lodash/omit";
import prisma from "persistence/context/prisma.config";
import PrismaOfficialRepository from "persistence/Official/PrismaOfficialRepository";
import OfficialService from "services/officials";
import { OfficialWithOptionalId } from "types/officials";

let officials: OfficialWithOptionalId[];
let officialService: OfficialService;
let officialConverter: OfficialConverter;

afterEach(async () => {
  const deleteOfficial = prisma.official.deleteMany();

  await prisma.$transaction([deleteOfficial]);

  await prisma.$disconnect();
});

beforeEach(async () => {
  officialConverter = new OfficialConverter();
  officials = await createFakeOfficials();
  officialService = new OfficialService({
    officialRepository: new PrismaOfficialRepository({
      prisma,
      officialConverter,
    }),
    officialConverter,
  });
});

it("Should get all instance of officials", async () => {
  const response = await officialService.get({});

  const result = (res: OfficialWithOptionalId) => _omit(res, ["id"]);

  expect(response.map(result)).toEqual(officials);

  const response2 = await officialService.get({
    contract: Contract.PERMANENT,
  });

  expect(response2.map(result)).toEqual(
    officials.filter(({ contract }) => contract === Contract.PERMANENT)
  );

  const response3 = await officialService.get({
    type: TypeOfOfficials.TEACHER,
  });

  expect(response3.map(result)).toEqual(
    officials.filter(({ type }) => type === TypeOfOfficials.TEACHER)
  );

  const response4 = await officialService.get({
    type: TypeOfOfficials.NOT_TEACHER,
  });

  expect(response4.map(result)).toEqual(
    officials.filter(({ type }) => type === TypeOfOfficials.NOT_TEACHER)
  );

  const response5 = await officialService.get({
    year: 2018,
  });

  expect(response5.map(result)).toEqual(
    officials.filter(({ dateOfEntry }) => dateOfEntry.getFullYear() === 2018)
  );
});

it("Should create 1 official", async () => {
  const official = {
    recordNumber: faker.datatype.number(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    position: faker.name.jobTitle(),
    dateOfEntry: new Date("2020-01-01"),
    chargeNumber: faker.datatype.number(),
    type: faker.random.arrayElement([
      TypeOfOfficials.TEACHER,
      TypeOfOfficials.NOT_TEACHER,
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
  // TODO: clear database
});

it("Should update the existing official", async () => {
  const official = {
    recordNumber: faker.datatype.number(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    position: faker.name.jobTitle(),
    dateOfEntry: new Date("2020-01-01"),
    chargeNumber: faker.datatype.number(),
    type: faker.random.arrayElement([
      TypeOfOfficials.TEACHER,
      TypeOfOfficials.NOT_TEACHER,
    ]),
    contract: faker.random.arrayElement([
      Contract.PERMANENT,
      Contract.TEMPORARY,
    ]),
  };

  // TODO fix this because tests should not depend on other tests
  const official2 = await prisma.official.findFirst({
    orderBy: { id: "desc" },
  });

  if (!official2) {
    throw new Error("No official found");
  }

  const officialEntity = officialConverter.fromModelToEntity({
    ...official,
    id: official2.id,
  });

  const result = await officialService.update(officialEntity);

  expect(result).toEqual({ ...official, id: official2.id });
});

it("Should delete a existing official record", async () => {
  const official = await prisma.official.findFirst({
    orderBy: { id: "desc" },
  });

  if (!official) {
    throw new Error("No official found");
  }

  const result = await officialService.delete(official.id);

  expect(result).toEqual(official);

  const count = await prisma.official.count();
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
      dateOfEntry: new Date("2018-03-04"),
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

  await prisma.official.createMany({ data: _officials });
  return _officials;
}
