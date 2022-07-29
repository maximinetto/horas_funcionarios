import { Official, Prisma } from "@prisma/client";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import OfficialEntity from "entities/Official";
import type prisma from "persistence/persistence.config";
import { OfficialWithoutId } from "types/officials";
import { Optional } from "typescript-optional";

export interface IOfficialRepository {
  getOne(id: number): Promise<Optional<OfficialEntity>>;
  get(where: Prisma.OfficialWhereInput): Promise<OfficialEntity[]>;
  create({
    recordNumber,
    firstName,
    lastName,
    position,
    dateOfEntry,
    chargeNumber,
    type,
    contract,
  }: OfficialWithoutId): Promise<OfficialEntity>;
  update(
    id: number,
    {
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    }: OfficialWithoutId
  ): Promise<OfficialEntity>;
  delete(id: number);
}

export default class OfficialRepository implements IOfficialRepository {
  private database: typeof prisma;
  private officialConverter: OfficialConverter;

  constructor({
    database,
    officialConverter,
  }: {
    database: typeof prisma;
    officialConverter: OfficialConverter;
  }) {
    this.database = database;
    this.officialConverter = officialConverter;
    this.toEntity = this.toEntity.bind(this);
    this.toEntities = this.toEntities.bind(this);
  }

  getOne(id: number): Promise<Optional<OfficialEntity>> {
    return this.database.official
      .findUnique({
        where: {
          id,
        },
      })
      .then((official) => {
        if (!official) {
          return Optional.empty();
        }
        return Optional.of(this.toEntity(official));
      });
  }

  get(where: Prisma.OfficialWhereInput) {
    return this.database.official
      .findMany({
        where: {
          ...where,
        },
      })
      .then(this.toEntities);
  }

  create({
    recordNumber,
    firstName,
    lastName,
    position,
    dateOfEntry,
    chargeNumber,
    type,
    contract,
  }: OfficialWithoutId) {
    return this.database.official
      .create({
        data: {
          recordNumber,
          firstName,
          lastName,
          position,
          dateOfEntry,
          chargeNumber,
          type,
          contract,
        },
      })
      .then(this.toEntity);
  }

  update(
    id: number,
    {
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    }: OfficialWithoutId
  ) {
    return this.database.official
      .update({
        where: { id },
        data: {
          recordNumber,
          firstName,
          lastName,
          position,
          dateOfEntry,
          chargeNumber,
          type,
          contract,
        },
      })
      .then(this.toEntity);
  }
  delete(id: number) {
    return this.database.official.delete({
      where: { id },
    });
  }

  private toEntity(official: Official) {
    return this.officialConverter.fromModelToEntity(official);
  }

  private toEntities(officials: Official[]) {
    return this.officialConverter.fromModelsToEntities(officials);
  }
}
