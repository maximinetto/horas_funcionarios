import { Decimal } from "decimal.js";

import HourlyBalanceEntity from "entities/HourlyBalanceTAS";
import NullActualBalance from "entities/null_object/NullActualBalance";
import { HourlyBalanceTAS as HourlyBalanceTASModel } from "types/hourlyBalance";

import { AbstractConverter } from "./converter";

export default class HourlyBalanceTASConverter extends AbstractConverter<
  HourlyBalanceTASModel,
  HourlyBalanceEntity
> {
  fromModelToEntity(model: HourlyBalanceTASModel): HourlyBalanceEntity {
    return new HourlyBalanceEntity(
      model.hourlyBalanceTAS ? model.hourlyBalanceTAS.id : "",
      model.year,
      new Decimal(
        model.hourlyBalanceTAS ? model.hourlyBalanceTAS.working.toString() : "0"
      ),
      new Decimal(
        model.hourlyBalanceTAS
          ? model.hourlyBalanceTAS.nonWorking.toString()
          : "0"
      ),
      new Decimal(
        model.hourlyBalanceTAS ? model.hourlyBalanceTAS.simple.toString() : "0"
      ),
      model.id
    );
  }
  fromEntityToModel(entity: HourlyBalanceEntity): HourlyBalanceTASModel {
    const actualBalanceId = entity.actualBalance.orElse(
      new NullActualBalance()
    ).id;

    return {
      year: entity.year,
      hourlyBalanceTAS: {
        hourlyBalanceId: entity.hourlyBalanceId,
        id: entity.id,
        working: BigInt(entity.working.toString()),
        nonWorking: BigInt(entity.nonWorking.toString()),
        simple: BigInt(entity.simple.toString()),
      },
      id: entity.hourlyBalanceId,
      actualBalanceId,
    };
  }
}
