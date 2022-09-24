import HourlyBalanceTASConverter from "../converters/models_to_entities/HourlyBalanceTASConverter";
import HourlyBalanceTeacherConverter from "../converters/models_to_entities/HourlyBalanceTeacher";
import HourlyBalanceEntity from "../entities/HourlyBalance";
import HourlyBalanceTAS from "../entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "../entities/HourlyBalanceTeacher";
import InvalidValueError from "../errors/InvalidValueError";
import { HourlyBalanceModel } from "../types/hourlyBalance";
import Creator from "./Creator";

export default class HourlyBalanceModelFactoryCreator
  implements Creator<HourlyBalanceModel, HourlyBalanceEntity>
{
  private hourlyBalanceTASConverter: HourlyBalanceTASConverter;
  private hourlyBalanceTeacherConverter: HourlyBalanceTeacherConverter;

  constructor({
    hourlyBalanceTASConverter,
    hourlyBalanceTeacherConverter,
  }: {
    hourlyBalanceTASConverter: HourlyBalanceTASConverter;
    hourlyBalanceTeacherConverter: HourlyBalanceTeacherConverter;
  }) {
    this.hourlyBalanceTASConverter = hourlyBalanceTASConverter;
    this.hourlyBalanceTeacherConverter = hourlyBalanceTeacherConverter;
  }

  create(type: HourlyBalanceEntity): HourlyBalanceModel {
    if (type instanceof HourlyBalanceTAS) {
      return this.hourlyBalanceTASConverter.fromEntityToModel(type);
    }

    if (type instanceof HourlyBalanceTeacher) {
      return this.hourlyBalanceTeacherConverter.fromEntityToModel(type);
    }

    throw new InvalidValueError(
      "The instance must be a valid subtype of HourlyBalance"
    );
  }

  createAll(types: HourlyBalanceEntity[]): HourlyBalanceModel[] {
    if (types.length === 0) return [];

    const type = types[0];

    if (type instanceof HourlyBalanceTAS) {
      return this.hourlyBalanceTASConverter.fromEntitiesToModels(
        types as HourlyBalanceTAS[]
      );
    }
    if (type instanceof HourlyBalanceTeacher) {
      return this.hourlyBalanceTeacherConverter.fromEntitiesToModels(
        types as HourlyBalanceTeacher[]
      );
    }

    throw new InvalidValueError(
      "The instance must be a valid subtype of HourlyBalance"
    );
  }
}
