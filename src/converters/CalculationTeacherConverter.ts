import { CalculationTeacher as CalculationTeacherModel } from "@/@types/calculations";
import CalculationTeacherEntity from "@/entities/CalculationTeacher";
import NullActualBalance from "@/entities/null_object/NullActualBalance";
import Decimal from "decimal.js";
import { AbstractConverter } from "./converter";

export default class CalculationTeacherConverter extends AbstractConverter<
  CalculationTeacherModel,
  CalculationTeacherEntity
> {
  fromModelToEntity(model: CalculationTeacherModel): CalculationTeacherEntity {
    return new CalculationTeacherEntity(
      model.id,
      model.year,
      model.month,
      new Decimal(model.surplus.toString()),
      new Decimal(model.discount.toString()),
      model.calculationId,
      model.observations ?? undefined,
      new NullActualBalance(model.actualBalanceId)
    );
  }
  fromEntityToModel(entity: CalculationTeacherEntity): CalculationTeacherModel {
    return {
      id: entity.id,
      year: entity.year,
      month: entity.month,
      surplus: BigInt(entity.getSurplus().toString()),
      discount: BigInt(entity.getDiscount().toString()),
      calculationId: entity.getCalculationId(),
      observations: entity.observations ?? null,
      actualBalanceId: entity.actualBalance.orElse(new NullActualBalance()).id,
    };
  }
}
