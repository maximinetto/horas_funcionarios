import { PrismaClient } from "@prisma/client";
import { Optional } from "typescript-optional";

import OfficialConverter from "../../converters/models_to_entities/OfficialConverter";
import OfficialEntity from "../../entities/Official";
import { OfficialWithOptionalId } from "../../types/officials";
import OfficialRepository from "../Official/OfficialRepository";
import PrismaRepository from "../PrismaRepository";

export default class PrismaOfficialRepository
  extends PrismaRepository<number, OfficialEntity>
  implements OfficialRepository
{
  private officialConverter: OfficialConverter;

  constructor({
    prisma,
    officialConverter,
  }: {
    prisma: PrismaClient;
    officialConverter: OfficialConverter;
  }) {
    super({ prisma, modelName: "official" });
    this.officialConverter = officialConverter;
    this.toEntity = this.toEntity.bind(this);
  }

  getLast(): Promise<Optional<OfficialEntity>> {
    throw new Error("Method not implemented.");
  }

  count(): Promise<number> {
    return this._prisma.official.count();
  }

  toEntity(official: OfficialWithOptionalId) {
    return this.officialConverter.fromModelToEntity(official);
  }

  toModel(value: OfficialEntity): OfficialWithOptionalId {
    return this.officialConverter.fromEntityToModel(value);
  }
}
