import { Decimal } from "decimal.js";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import CalculationTeacherEntity from "entities/CalculationTeacher";
import { NotNullableCalculationWithTeacher } from "types/calculations";
import { generateRandomUUIDV4 } from "utils/strings";

import { AbstractConverter } from "./AbstractConverter";

export default class CalculationTeacherConverter extends AbstractConverter<
  NotNullableCalculationWithTeacher,
  CalculationTeacherEntity
> {
  fromModelToEntity(
    model: NotNullableCalculationWithTeacher
  ): CalculationTeacherEntity {
    const { surplus, discount } = model.calculationTeacher;

    const { id, year, month, observations, actualBalanceId } = model;

    return new CalculationTeacherEntity({
      id,
      year,
      month,
      surplus: new Decimal(surplus.toString()),
      discount: new Decimal(discount.toString()),
      observations: observations ?? undefined,
      actualBalance: new ActualBalanceTeacher({
        id: actualBalanceId,
        year,
      }),
    });
  }
  fromEntityToModel(
    entity: CalculationTeacherEntity
  ): NotNullableCalculationWithTeacher {
    return {
      id: entity.id,
      year: entity.year,
      month: entity.month,
      calculationTeacher: {
        id: entity.id,
        calculationId: generateRandomUUIDV4(),
        surplus: BigInt(entity.surplus.toString()),
        discount: BigInt(entity.discount.toString()),
      },
      observations: entity.observations ?? null,
      actualBalanceId: entity.actualBalance
        ? entity.actualBalance.id
        : generateRandomUUIDV4(),
    };
  }
}
