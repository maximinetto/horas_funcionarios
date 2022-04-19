import { CalculationTeacher as CalculationTeacherModel } from "@/@types/calculations";
import CalculationTeacherEntity from "@/entities/CalculationTeacher";
import NullActualBalance from "@/entities/null_object/NullActualBalance";
import Decimal from "decimal.js";
import Converter from "./converter";

export default class CalculationTeacherConverter
  implements Converter<CalculationTeacherModel, CalculationTeacherEntity>
{
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
      id: entity.getId(),
      year: entity.getYear(),
      month: entity.getMonth(),
      surplus: BigInt(entity.getSurplus().toString()),
      discount: BigInt(entity.getDiscount().toString()),
      calculationId: entity.getCalculationId(),
      observations: entity.getObservations() ?? null,
      actualBalanceId: entity
        .getActualBalance()
        .orElse(new NullActualBalance())
        .getId(),
    };
  }
}
