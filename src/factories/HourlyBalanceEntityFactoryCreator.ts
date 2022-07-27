import { HourlyBalance as HourlyBalanceModel } from "@prisma/client";
import HourlyBalanceTASConverter from "converters/models_to_entities/HourlyBalanceTASConverter";
import HourlyBalanceTeacherConverter from "converters/models_to_entities/HourlyBalanceTeacher";
import HourlyBalanceEntity from "entities/HourlyBalance";
import InvalidValueError from "errors/InvalidValueError";
import { HourlyBalanceTAS, HourlyBalanceTeacher } from "types/hourlyBalance";

import Creator from "./Creator";

export default class HourlyBalanceEntityFactoryCreator
  implements Creator<HourlyBalanceEntity[], HourlyBalanceModel[]>
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

  create(types: HourlyBalanceModel[]): HourlyBalanceEntity[] {
    if (types.length === 0) return [];

    const type = types[0];

    if ("hourlyBalanceTAS" in type) {
      return this.hourlyBalanceTASConverter.fromModelsToEntities(
        types as HourlyBalanceTAS[]
      );
    }
    if ("hourlyBalanceTeacher" in type) {
      return this.hourlyBalanceTeacherConverter.fromModelsToEntities(
        types as HourlyBalanceTeacher[]
      );
    }

    throw new InvalidValueError(
      "The instance must be a valid subtype of HourlyBalance"
    );
  }
}
