import { Contract, TypeOfOfficials } from "@prisma/client";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import Official from "entities/Official";
import { IOfficialRepository } from "persistence/officials";
import { OfficialWithoutId } from "types/officials";
import { lastDateOfTheYear } from "utils/date";
import removeKeyIfValueDoesNotDefinite from "utils/removeKeyIfValueDoesNotDefinite";

export default class OfficialService {
  private officialRepository: IOfficialRepository;
  private officialConverter: OfficialConverter;

  constructor({
    officialRepository,
    officialConverter,
  }: {
    officialRepository: IOfficialRepository;
    officialConverter: OfficialConverter;
  }) {
    this.officialRepository = officialRepository;
    this.officialConverter = officialConverter;
    this.toModel = this.toModel.bind(this);
    this.toModels = this.toModels.bind(this);
  }

  async get({
    type,
    contract,
    year,
  }: {
    type?: TypeOfOfficials;
    contract?: Contract;
    year?: number;
  }) {
    const date = lastDateOfTheYear(year);
    const where = {
      type,
      contract,
      dateOfEntry: date
        ? {
            gte: new Date(`${year}-01-01`),
            lte: date,
          }
        : undefined,
    };

    return this.officialRepository.get(where).then(this.toModels);
  }
  async create({
    recordNumber,
    firstName,
    lastName,
    position,
    dateOfEntry,
    chargeNumber,
    type,
    contract,
  }) {
    return this.officialRepository
      .create({
        recordNumber,
        firstName,
        lastName,
        position,
        dateOfEntry,
        chargeNumber,
        type,
        contract,
      })
      .then(this.toModel);
  }
  async update(
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
    const fields = {
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    };
    removeKeyIfValueDoesNotDefinite(fields);

    return this.officialRepository.update(id, fields).then(this.toModel);
  }
  async delete(id) {
    return this.officialRepository.delete(id).then(this.toModel);
  }

  private toModel(entity: Official) {
    return this.officialConverter.fromEntityToModel(entity);
  }

  private toModels(entities: Official[]) {
    return this.officialConverter.fromEntitiesToModels(entities);
  }
}
