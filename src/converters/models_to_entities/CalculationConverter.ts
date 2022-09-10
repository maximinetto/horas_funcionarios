import { AbstractConverter } from "converters/models_to_entities/AbstractConverter";
import CalculationTASConverter from "converters/models_to_entities/CalculationTASConverter";
import CalculationTeacherConverter from "converters/models_to_entities/CalculationTeacherConverter";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTeacherEntity from "entities/CalculationTeacher";
import InvalidValueError from "errors/InvalidValueError";
import {
  CalculationModel,
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

  constructor({
    calculationTASConverter,
    calculationTeacherConverter,
  }: {
    calculationTASConverter: CalculationTASConverter;
    calculationTeacherConverter: CalculationTeacherConverter;
  }) {
    super();
    this.calculationTASConverter = calculationTASConverter;
    this.calculationTeacherConverter = calculationTeacherConverter;
    this.fromEntityToModel = this.fromEntityToModel.bind(this);
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

    throw new InvalidValueError("Model must be a subclass of calculations");
  }
  fromEntityToModel(entity: AllCalculationEntities): AllCalculationTypes {
    if (this.isTASEntity(entity)) {
      return this.calculationTASConverter.fromEntityToModel(entity);
    }

    if (this.isTeacherEntity(entity)) {
      return this.calculationTeacherConverter.fromEntityToModel(entity);
    }

    throw new InvalidValueError(
      "Entity is not a derived instance of Calculation"
    );
  }
}
