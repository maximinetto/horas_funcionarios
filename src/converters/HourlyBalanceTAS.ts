import { HourlyBalanceTAS as HourlyBalanceTASModel } from "@/@types/hourlyBalance";
import HourlyBalanceEntity from "@/entities/HourlyBalanceTAS";
import NullActualBalance from "@/entities/null_object/NullActualBalance";
import { Decimal } from "decimal.js";
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
        hourlyBalanceId: entity.getHourlyBalanceId(),
        id: entity.id,
        working: BigInt(entity.getWorking().toString()),
        nonWorking: BigInt(entity.getNonWorking().toString()),
        simple: BigInt(entity.getSimple().toString()),
      },
      id: entity.getHourlyBalanceId(),
      actualBalanceId,
    };
  }
}
