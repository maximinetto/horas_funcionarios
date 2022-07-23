import { Decimal } from "decimal.js";
import CalculationTeacherEntity from "entities/CalculationTeacher";
import NullActualBalance from "entities/null_object/NullActualBalance";
import { NotNullableCalculationWithTeacher } from "types/calculations";

import { AbstractConverter } from "./converter";

export default class CalculationTeacherConverter extends AbstractConverter<
  NotNullableCalculationWithTeacher,
  CalculationTeacherEntity
> {
  fromModelToEntity(
    model: NotNullableCalculationWithTeacher
  ): CalculationTeacherEntity {
    const { surplus, discount, calculationId } = model.calculationTeacher;

    return new CalculationTeacherEntity(
      model.id,
      model.year,
      model.month,
      new Decimal(surplus.toString()),
      new Decimal(discount.toString()),
      calculationId,
      model.observations ?? undefined,
      new NullActualBalance(model.actualBalanceId)
    );
  }
  fromEntityToModel(
    entity: CalculationTeacherEntity
  ): NotNullableCalculationWithTeacher {
    return {
      id: entity.calculationId,
      year: entity.year,
      month: entity.month,
      calculationTeacher: {
        id: entity.id,
        calculationId: entity.calculationId,
        surplus: BigInt(entity.getSurplus().toString()),
        discount: BigInt(entity.getDiscount().toString()),
      },
      observations: entity.observations ?? null,
      actualBalanceId: entity.actualBalance.orElse(new NullActualBalance()).id,
    };
  }
}
