import { Calculation as CalculationModel } from "@prisma/client";

import {
  CalculationWithTAS,
  CalculationWithTeacher,
  NotNullableCalculationWithTAS,
  NotNullableCalculationWithTeacher,
} from "@/@types/calculations";
import ActualBalance from "@/entities/ActualBalance";
import Calculation from "@/entities/Calculation";
import CalculationTAS from "@/entities/CalculationTAS";
import CalculationTeacherEntity from "@/entities/CalculationTeacher";

import CalculationTASConverter from "./CalculationTASConverter";
import CalculationTeacherConverter from "./CalculationTeacherConverter";
import { AbstractConverter } from "./converter";

type AllCalculationTypes =
  | CalculationWithTAS
  | CalculationWithTeacher
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
    calculationTASConverter?: CalculationTASConverter,
    calculationTeacherConverter?: CalculationTeacherConverter
  ) {
    super();
    this.calculationTASConverter =
      calculationTASConverter ?? new CalculationTASConverter();
    this.calculationTeacherConverter =
      calculationTeacherConverter ?? new CalculationTeacherConverter();
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
      return this.calculationTASConverter.fromModelToEntity({
        id: model.id,
        year: model.year,
        month: model.month,
        surplusBusiness: BigInt(
          model.calculationTAS.surplusBusiness.toString()
        ),
        discount: BigInt(model.calculationTAS.discount.toString()),
        workingOvertime: BigInt(
          model.calculationTAS.workingOvertime.toString()
        ),
        workingNightOvertime: BigInt(
          model.calculationTAS.workingNightOvertime.toString()
        ),
        nonWorkingOvertime: BigInt(
          model.calculationTAS.nonWorkingOvertime.toString()
        ),
        nonWorkingNightOvertime: BigInt(
          model.calculationTAS.nonWorkingNightOvertime.toString()
        ),
        surplusSimple: BigInt(model.calculationTAS.surplusSimple.toString()),
        surplusNonWorking: BigInt(
          model.calculationTAS.surplusNonWorking.toString()
        ),
        compensatedNightOvertime: BigInt(
          model.calculationTAS.compensatedNightOvertime.toString()
        ),
        observations: model.observations,
        actualBalanceId: model.actualBalanceId,
        calculationId: model.calculationTAS.calculationId,
      });
    }
    if (this.isTeacherModel(model)) {
      return this.calculationTeacherConverter.fromModelToEntity({
        id: model.id,
        year: model.year,
        month: model.month,
        actualBalanceId: model.actualBalanceId,
        calculationId: model.calculationTeacher.calculationId,
        discount: model.calculationTeacher.discount,
        observations: model.observations,
        surplus: BigInt(model.calculationTeacher.surplus.toString()),
      });
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
      const model = this.calculationTASConverter.fromEntityToModel(entity);
      return {
        actualBalanceId: model.actualBalanceId,
        calculationTAS: {
          calculationId: model.calculationId,
          discount: model.discount,
          id: model.id,
          compensatedNightOvertime: model.compensatedNightOvertime,
          nonWorkingNightOvertime: model.nonWorkingNightOvertime,
          nonWorkingOvertime: model.nonWorkingOvertime,
          surplusBusiness: model.surplusBusiness,
          surplusNonWorking: model.surplusNonWorking,
          surplusSimple: model.surplusSimple,
          workingNightOvertime: model.workingNightOvertime,
          workingOvertime: model.workingOvertime,
        },
        id: model.calculationId,
        month: model.month,
        observations: model.observations,
        year: model.year,
      };
    }

    if (this.isTeacherEntity(entity)) {
      const model = this.calculationTeacherConverter.fromEntityToModel(entity);
      return {
        actualBalanceId: model.actualBalanceId,
        calculationTeacher: {
          calculationId: model.calculationId,
          discount: model.discount,
          id: model.id,

          surplus: model.surplus,
        },
        id: model.calculationId,
        month: model.month,
        observations: model.observations,
        year: model.year,
      };
    }

    return {
      id: entity.id,
      month: entity.month,
      observations: entity.observations ?? null,
      year: entity.year,
      calculationTAS: null,
      calculationTeacher: null,
      actualBalanceId: entity.actualBalance
        .map((actualBalance) => actualBalance.id)
        .orElseGet(() => ""),
    };
  }
}
