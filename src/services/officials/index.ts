import { Contract, TypeOfOfficials } from "@prisma/client";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import Official from "entities/Official";
import OfficialRepository from "persistence/Official/OfficialRepository";
import { lastDateOfTheYear } from "utils/date";

type Get = {
  type?: TypeOfOfficials;
  contract?: Contract;
  year?: number;
};
export default class OfficialService {
  private officialRepository: OfficialRepository;
  private officialConverter: OfficialConverter;

  constructor({
    officialRepository,
    officialConverter,
  }: {
    officialRepository: OfficialRepository;
    officialConverter: OfficialConverter;
  }) {
    this.officialRepository = officialRepository;
    this.officialConverter = officialConverter;
    this.toModel = this.toModel.bind(this);
    this.toModels = this.toModels.bind(this);
  }

  get(props?: Get) {
    const { type, contract, year } = props || {};
    const date = lastDateOfTheYear(year);
    const where = {
      type: type,
      contract: contract,
      dateOfEntry: date
        ? {
            gte: new Date(`${year}-01-01`),
            lte: date,
          }
        : undefined,
    };

    return this.officialRepository
      .filter({ where: { ...where } })
      .then(this.toModels);
  }

  async create(official: Official) {
    return this.officialRepository.add(official).then(this.toModel);
  }

  update(official: Official) {
    return this.officialRepository.set(official).then(this.toModel);
  }

  delete(id: number) {
    return this.officialRepository
      .remove(Official.default(id))
      .then(this.toModel);
  }

  private toModel(entity: Official) {
    console.log("entity:", entity);
    return this.officialConverter.fromEntityToModel(entity);
  }

  private toModels(entities: Official[]) {
    return this.officialConverter.fromEntitiesToModels(entities);
  }
}
