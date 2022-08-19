import { Decimal } from "decimal.js";
import HourlyBalanceEntity from "entities/HourlyBalanceTAS";
import { HourlyBalanceTAS as HourlyBalanceTASModel } from "types/hourlyBalance";
import { generateRandomUUIDV4 } from "utils/strings";

import { AbstractConverter } from "./AbstractConverter";

export default class HourlyBalanceTASConverter extends AbstractConverter<
  HourlyBalanceTASModel,
  HourlyBalanceEntity
> {
  fromModelToEntity(model: HourlyBalanceTASModel): HourlyBalanceEntity {
    return new HourlyBalanceEntity({
      id: model.hourlyBalanceTAS ? model.hourlyBalanceTAS.id : "",
      year: model.year,
      working: new Decimal(
        model.hourlyBalanceTAS ? model.hourlyBalanceTAS.working.toString() : "0"
      ),
      nonWorking: new Decimal(
        model.hourlyBalanceTAS
          ? model.hourlyBalanceTAS.nonWorking.toString()
          : "0"
      ),
      simple: new Decimal(
        model.hourlyBalanceTAS ? model.hourlyBalanceTAS.simple.toString() : "0"
      ),
    });
  }
  fromEntityToModel(entity: HourlyBalanceEntity): HourlyBalanceTASModel {
    const actualBalanceId = entity.actualBalance
      ? entity.actualBalance.id
      : generateRandomUUIDV4();
    const hourlyBalanceId = generateRandomUUIDV4();

    return {
      year: entity.year,
      hourlyBalanceTAS: {
        hourlyBalanceId,
        id: entity.id,
        working: BigInt(entity.working.toString()),
        nonWorking: BigInt(entity.nonWorking.toString()),
        simple: BigInt(entity.simple.toString()),
      },
      id: hourlyBalanceId,
      actualBalanceId,
    };
  }
}
