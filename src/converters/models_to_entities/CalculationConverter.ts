import { Calculation as CalculationModel } from "@prisma/client";
import { AbstractConverter } from "converters/models_to_entities/AbstractConverter";
import CalculationTASConverter from "converters/models_to_entities/CalculationTASConverter";
import CalculationTeacherConverter from "converters/models_to_entities/CalculationTeacherConverter";
import ActualBalance from "entities/ActualBalance";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTeacherEntity from "entities/CalculationTeacher";
import {
  CalculationWithTAS,
  CalculationWithTeacher,
  NotNullableCalculationWithTAS,
  NotNullableCalculationWithTeacher,
} from "types/calculations";

type AllCalculationTypes =
  | NotNullableCalculationWithTAS
  | NotNullableCalculationWithTeacher
  | CalculationModel;
type AllCalculationEntities =
  | CalculationTeacherEntity
  | CalculationTAS
  | Calculation;

export default class CalculationConverter extends AbstractConverter<
  AllCalculationTypes,
  Calculation
> {
  private calculationTASConverter: CalculationTASConverter;
  private calculationTeacherConverter: CalculationTeacherConverter;

  constructor(
    calculationTASConverter: CalculationTASConverter,
    calculationTeacherConverter: CalculationTeacherConverter
  ) {
    super();
    this.calculationTASConverter = calculationTASConverter;
    this.calculationTeacherConverter = calculationTeacherConverter;
  }

  public isTASModel(
    model: AllCalculationTypes
  ): model is NotNullableCalculationWithTAS {
    return (<CalculationWithTAS>model).calculationTAS != null;
  }

  public isTeacherModel(
    model: AllCalculationTypes
  ): model is NotNullableCalculationWithTeacher {
    return (<CalculationWithTeacher>model).calculationTeacher != null;
  }

  private isTASEntity(
    entity: AllCalculationEntities
  ): entity is CalculationTAS {
    return entity instanceof CalculationTAS;
  }

  private isTeacherEntity(
    entity: AllCalculationEntities
  ): entity is CalculationTeacherEntity {
    return entity instanceof CalculationTeacherEntity;
  }

  fromModelToEntity(model: AllCalculationTypes) {
    if (this.isTASModel(model)) {
      return this.calculationTASConverter.fromModelToEntity(model);
    }
    if (this.isTeacherModel(model)) {
      return this.calculationTeacherConverter.fromModelToEntity(model);
    }

    const actualBalance = model.actualBalanceId
      ? new ActualBalance(model.actualBalanceId, model.year)
      : undefined;
    return new Calculation(
      model.id,
      model.year,
      model.month,
      model.observations ?? "",
      actualBalance
    );
  }
  fromEntityToModel(entity: AllCalculationEntities): AllCalculationTypes {
    if (this.isTASEntity(entity)) {
      return this.calculationTASConverter.fromEntityToModel(entity);
    }

    if (this.isTeacherEntity(entity)) {
      return this.calculationTeacherConverter.fromEntityToModel(entity);
    }

    return {
      id: entity.id,
      month: entity.month,
      observations: entity.observations ?? null,
      year: entity.year,
      actualBalanceId: entity.actualBalance
        .map((actualBalance) => actualBalance.id)
        .orElseGet(() => ""),
    };
  }
}
