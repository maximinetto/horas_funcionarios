import ActualBalanceEntity from "@/entities/ActualBalance";
import NullOfficial from "@/entities/null_object/NullOfficial";
import Official from "@/entities/Official";
import {
  ActualBalance as ActualBalanceModel,
  Contract,
  TypeOfOfficials,
} from "@prisma/client";
import Decimal from "decimal.js";
import { DateTime } from "luxon";
import { AbstractConverter } from "./converter";

export default class ActualBalanceConverter extends AbstractConverter<
  ActualBalanceModel,
  ActualBalanceEntity
> {
  fromModelToEntity(model: ActualBalanceModel): ActualBalanceEntity {
    return new ActualBalanceEntity(
      model.id,
      model.year,
      new Decimal(model.total.toString()),
      new Official(
        model.officialId,
        0,
        "",
        "",
        "",
        Contract.PERMANENT,
        TypeOfOfficials.NOT_TEACHER,
        DateTime.fromJSDate(new Date()),
        0
      )
    );
  }
  fromEntityToModel(entity: ActualBalanceEntity): ActualBalanceModel {
    return {
      id: entity.getId(),
      officialId: entity.getOfficial().orElse(new NullOfficial()).getId(),
      year: entity.getYear(),
      total: BigInt(entity.getTotal().toString()),
    };
  }
}
