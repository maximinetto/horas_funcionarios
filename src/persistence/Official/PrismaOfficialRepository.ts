import { PrismaClient } from "@prisma/client";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import OfficialEntity from "entities/Official";
import OfficialRepository from "persistence/Official/OfficialRepository";
import PrismaRepository from "persistence/PrismaRepository";
import { OfficialWithOptionalId } from "types/officials";

export default class PrismaOfficialRepository
  extends PrismaRepository<number, OfficialEntity>
  implements OfficialRepository
{
  private officialConverter: OfficialConverter;

  constructor({
    database,
    officialConverter,
  }: {
    database: PrismaClient;
    officialConverter: OfficialConverter;
  }) {
    super({ database, modelName: "official" });
    this.officialConverter = officialConverter;
    this.toEntity = this.toEntity.bind(this);
  }

  toEntity(official: OfficialWithOptionalId) {
    return this.officialConverter.fromModelToEntity(official);
  }

  toPersistance(value: OfficialEntity): OfficialWithOptionalId {
    return this.officialConverter.fromEntityToModel(value);
  }
}
