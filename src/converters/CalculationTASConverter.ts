import { CalculationTAS as CalculationTASModel } from "@/@types/calculations";
import CalculationTASEntity from "@/entities/CalculationTAS";
import NullActualBalance from "@/entities/null_object/NullActualBalance";
import { Decimal } from "decimal.js";
import { AbstractConverter } from "./converter";

export default class CalculationTASConverter extends AbstractConverter<
  CalculationTASModel,
  CalculationTASEntity
> {
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
      id: entity.id,
      year: entity.year,
      month: entity.month,
      surplusBusiness: BigInt(entity.surplusBusiness.toString()),
      surplusNonWorking: BigInt(entity.surplusNonWorking.toString()),
      surplusSimple: BigInt(entity.surplusSimple.toString()),
      discount: BigInt(entity.discount.toString()),
      workingOvertime: BigInt(entity.workingOvertime.toString()),
      workingNightOvertime: BigInt(entity.workingNightOvertime.toString()),
      nonWorkingOvertime: BigInt(entity.nonWorkingOvertime.toString()),
      nonWorkingNightOvertime: BigInt(
        entity.nonWorkingNightOvertime.toString()
      ),
      compensatedNightOvertime: BigInt(
        entity.compensatedNightOvertime.toString()
      ),
      calculationId: entity.calculationId,
      observations: entity.observations ?? null,
      actualBalanceId: entity.actualBalance.orElse(new NullActualBalance()).id,
    };
  }
}
