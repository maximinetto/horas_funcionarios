import { Decimal } from "decimal.js";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import CalculationTASEntity from "entities/CalculationTAS";
import { NotNullableCalculationWithTAS } from "types/calculations";
import { generateRandomUUIDV4 } from "utils/strings";

import { AbstractConverter } from "./AbstractConverter";

export default class CalculationTASConverter extends AbstractConverter<
  NotNullableCalculationWithTAS,
  CalculationTASEntity
> {
  fromModelToEntity(
    model: NotNullableCalculationWithTAS
  ): CalculationTASEntity {
    const { observations, actualBalanceId, month, year } = model;

    const {
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

    return new CalculationTASEntity({
      id,
      year,
      month,
      surplusBusiness: new Decimal(surplusBusiness.toString()),
      surplusNonWorking: new Decimal(surplusNonWorking.toString()),
      surplusSimple: new Decimal(surplusSimple.toString()),
      discount: new Decimal(discount.toString()),
      workingOvertime: new Decimal(workingOvertime.toString()),
      workingNightOvertime: new Decimal(workingNightOvertime.toString()),
      nonWorkingOvertime: new Decimal(nonWorkingOvertime.toString()),
      nonWorkingNightOvertime: new Decimal(nonWorkingNightOvertime.toString()),
      compensatedNightOvertime: new Decimal(
        compensatedNightOvertime.toString()
      ),
      observations: observations ?? undefined,
      actualBalance: new ActualBalanceTAS({
        id: actualBalanceId,
        year,
      }),
    });
  }
  fromEntityToModel(
    entity: CalculationTASEntity
  ): NotNullableCalculationWithTAS {
    const calculationId = generateRandomUUIDV4();
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
        calculationId,
      },
      id: calculationId,
      observations: entity.observations ?? null,
      actualBalanceId: entity.actualBalance
        ? entity.actualBalance.id
        : generateRandomUUIDV4(),
    };
  }
}
