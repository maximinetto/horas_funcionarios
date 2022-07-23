import { Decimal } from "decimal.js";

import HourlyBalanceEntity from "entities/HourlyBalanceTeacher";
import NullActualBalance from "entities/null_object/NullActualBalance";
import { HourlyBalanceTeacher as HourlyBalanceTeacherModel } from "types/hourlyBalance";

import { AbstractConverter } from "./converter";

export default class HourlyBalanceTeacherConverter extends AbstractConverter<
  HourlyBalanceTeacherModel,
  HourlyBalanceEntity
> {
  fromModelToEntity(model: HourlyBalanceTeacherModel): HourlyBalanceEntity {
    return new HourlyBalanceEntity(
      model.hourlyBalanceTeacher ? model.hourlyBalanceTeacher.id : "",
      model.year,
      new Decimal(
        model.hourlyBalanceTeacher
          ? model.hourlyBalanceTeacher.balance.toString()
          : "0"
      ),
      model.id
    );
  }
  fromEntityToModel(entity: HourlyBalanceEntity): HourlyBalanceTeacherModel {
    const actualBalanceId = entity.actualBalance.orElse(
      new NullActualBalance()
    ).id;

    return {
      year: entity.year,
      hourlyBalanceTeacher: {
        hourlyBalanceId: entity.getHourlyBalanceId(),
        id: entity.id,
        balance: BigInt(entity.getBalance().toString()),
      },
      id: entity.getHourlyBalanceId(),
      actualBalanceId,
    };
  }
}
