import { Decimal } from "decimal.js";

import { NotNullableCalculationWithTAS } from "@/@types/calculations";
import CalculationTASEntity from "@/entities/CalculationTAS";
import NullActualBalance from "@/entities/null_object/NullActualBalance";

import { AbstractConverter } from "./converter";

export default class CalculationTASConverter extends AbstractConverter<
  NotNullableCalculationWithTAS,
  CalculationTASEntity
> {
  fromModelToEntity(
    model: NotNullableCalculationWithTAS
  ): CalculationTASEntity {
    const { observations, actualBalanceId, month, year } = model;

    const {
      calculationId,
      compensatedNightOvertime,
      discount,
      nonWorkingNightOvertime,
      nonWorkingOvertime,
      surplusBusiness,
      surplusNonWorking,
      surplusSimple,
      workingNightOvertime,
      workingOvertime,
      id,
    } = model.calculationTAS;

    return new CalculationTASEntity(
      id,
      year,
      month,
      new Decimal(surplusBusiness.toString()),
      new Decimal(surplusNonWorking.toString()),
      new Decimal(surplusSimple.toString()),
      new Decimal(discount.toString()),
      new Decimal(workingOvertime.toString()),
      new Decimal(workingNightOvertime.toString()),
      new Decimal(nonWorkingOvertime.toString()),
      new Decimal(nonWorkingNightOvertime.toString()),
      new Decimal(compensatedNightOvertime.toString()),
      calculationId,
      observations ?? undefined,
      new NullActualBalance(actualBalanceId)
    );
  }
  fromEntityToModel(
    entity: CalculationTASEntity
  ): NotNullableCalculationWithTAS {
    return {
      year: entity.year,
      month: entity.month,
      calculationTAS: {
        id: entity.id,
        surplusBusiness: BigInt(entity.surplusBusiness.toString()),
        surplusNonWorking: BigInt(entity.surplusNonWorking.toString()),
        surplusSimple: BigInt(entity.surplusSimple.toString()),
        workingOvertime: BigInt(entity.workingOvertime.toString()),
        workingNightOvertime: BigInt(entity.workingNightOvertime.toString()),
        nonWorkingOvertime: BigInt(entity.nonWorkingOvertime.toString()),
        nonWorkingNightOvertime: BigInt(
          entity.nonWorkingNightOvertime.toString()
        ),
        compensatedNightOvertime: BigInt(
          entity.compensatedNightOvertime.toString()
        ),
        discount: BigInt(entity.discount.toString()),
        calculationId: entity.calculationId,
      },
      id: entity.calculationId,
      observations: entity.observations ?? null,
      actualBalanceId: entity.actualBalance.orElse(new NullActualBalance()).id,
    };
  }
}
