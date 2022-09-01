import { FilterQuery } from "@mikro-orm/core";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import Official, { Contract, TypeOfOfficial } from "entities/Official";
import NotExistsError from "errors/NotExistsError";
import { DateTime } from "luxon";
import OfficialRepository from "persistence/Official/OfficialRepository";
import { lastDateOfTheYear } from "utils/date";

type Get = {
  type?: TypeOfOfficial;
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
            $gte: DateTime.fromObject({
              day: 1,
              month: 1,
              year,
            }),
            $lte: DateTime.fromJSDate(date),
          }
        : undefined,
    } as FilterQuery<Official>;

    return this.officialRepository.filter(where).then(this.toModels);
  }

  async create(official: Official) {
    const officialSaved = await this.officialRepository.add(official);
    return this.toModel(officialSaved);
  }

  async update(official: Official) {
    const officialSaved = await this.officialRepository.set(official);
    return this.toModel(officialSaved);
  }

  async delete(id: number) {
    const official = await this.officialRepository.get(id);
    return official
      .map((value) => {
        return this.officialRepository.remove(value).then(async (_value) => {
          return this.toModel(_value);
        });
      })
      .orElseThrow(
        () =>
          new NotExistsError("The official doesn't not exists in the system")
      );
  }

  private toModel(entity: Official) {
    return this.officialConverter.fromEntityToModel(entity);
  }

  private toModels(entities: Official[]) {
    return this.officialConverter.fromEntitiesToModels(entities);
  }
}
