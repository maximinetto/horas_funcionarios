import { Decimal } from "decimal.js";

import HourlyBalanceEntity from "../../entities/HourlyBalanceTeacher";
import { HourlyBalanceTeacher as HourlyBalanceTeacherModel } from "../../types/hourlyBalance";
import { generateRandomUUIDV4 } from "../../utils/strings";
import { AbstractConverter } from "./AbstractConverter";

export default class HourlyBalanceTeacherConverter extends AbstractConverter<
  HourlyBalanceTeacherModel,
  HourlyBalanceEntity
> {
  fromModelToEntity(model: HourlyBalanceTeacherModel): HourlyBalanceEntity {
    return new HourlyBalanceEntity({
      id: model.id,
      year: model.year,
      balance: new Decimal(
        model.hourlyBalanceTeacher
          ? model.hourlyBalanceTeacher.balance.toString()
          : "0"
      ),
    });
  }
  fromEntityToModel(entity: HourlyBalanceEntity): HourlyBalanceTeacherModel {
    const actualBalanceId = entity.actualBalance
      ? entity.actualBalance.id
      : generateRandomUUIDV4();

    const hourlyBalanceId = generateRandomUUIDV4();

    return {
      year: entity.year,
      hourlyBalanceTeacher: {
        hourlyBalanceId,
        id: entity.id,
        balance: BigInt(entity.balance.toString()),
      },
      id: hourlyBalanceId,
      actualBalanceId,
    };
  }
}
