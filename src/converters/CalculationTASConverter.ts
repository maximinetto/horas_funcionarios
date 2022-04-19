import { CalculationTAS as CalculationTASModel } from "@/@types/calculations";
import CalculationTASEntity from "@/entities/CalculationTAS";
import NullActualBalance from "@/entities/null_object/NullActualBalance";
import Decimal from "decimal.js";
import Converter from "./converter";

export default class CalculationTASConverter
  implements Converter<CalculationTASModel, CalculationTASEntity>
{
  fromModelToEntity(model: CalculationTASModel): CalculationTASEntity {
    return new CalculationTASEntity(
      model.id,
      model.year,
      model.month,
      new Decimal(model.surplusBusiness.toString()),
      new Decimal(model.surplusNonWorking.toString()),
      new Decimal(model.surplusSimple.toString()),
      new Decimal(model.discount.toString()),
      new Decimal(model.workingOvertime.toString()),
      new Decimal(model.workingNightOvertime.toString()),
      new Decimal(model.nonWorkingOvertime.toString()),
      new Decimal(model.nonWorkingNightOvertime.toString()),
      new Decimal(model.compensatedNightOvertime.toString()),
      model.calculationId,
      model.observations ?? undefined,
      new NullActualBalance(model.actualBalanceId)
    );
  }
  fromEntityToModel(entity: CalculationTASEntity): CalculationTASModel {
    return {
      id: entity.getId(),
      year: entity.getYear(),
      month: entity.getMonth(),
      surplusBusiness: BigInt(entity.getSurplusBusiness().toString()),
      surplusNonWorking: BigInt(entity.getSurplusNonWorking().toString()),
      surplusSimple: BigInt(entity.getSurplusSimple().toString()),
      discount: BigInt(entity.getDiscount().toString()),
      workingOvertime: BigInt(entity.getWorkingOvertime().toString()),
      workingNightOvertime: BigInt(entity.getWorkingNightOvertime().toString()),
      nonWorkingOvertime: BigInt(entity.getNonWorkingOvertime().toString()),
      nonWorkingNightOvertime: BigInt(
        entity.getNonWorkingNightOvertime().toString()
      ),
      compensatedNightOvertime: BigInt(
        entity.getCompensatedNightOvertime().toString()
      ),
      calculationId: entity.getCalculationId(),
      observations: entity.getObservations() ?? null,
      actualBalanceId: entity
        .getActualBalance()
        .orElse(new NullActualBalance())
        .getId(),
    };
  }
}
