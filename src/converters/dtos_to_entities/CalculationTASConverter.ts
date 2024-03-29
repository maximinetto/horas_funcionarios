import { Decimal } from "decimal.js";
import CalculationTASDTO from "dto/create/calculationTASDTO";
import CalculationTASEntity from "entities/CalculationTAS";
import NullActualBalance from "entities/null_object/NullActualBalance";

import { AbstractConverter } from "./AbstractConverter";

export default class CalculationTASConverter extends AbstractConverter<
  CalculationTASEntity,
  CalculationTASDTO
> {
  fromDTOToEntity(dto: CalculationTASDTO): CalculationTASEntity {
    return new CalculationTASEntity(
      dto.id,
      dto.year,
      dto.month,
      new Decimal(dto.surplusBusiness.toString()),
      new Decimal(dto.surplusNonWorking.toString()),
      new Decimal(dto.surplusSimple.toString()),
      new Decimal(dto.discount.toString()),
      new Decimal(dto.workingOvertime.toString()),
      new Decimal(dto.workingNightOvertime.toString()),
      new Decimal(dto.nonWorkingOvertime.toString()),
      new Decimal(dto.nonWorkingNightOvertime.toString()),
      new Decimal(dto.compensatedNightOvertime.toString()),
      dto.calculationId,
      dto.observations ?? undefined,
      new NullActualBalance(dto.actualBalanceId)
    );
  }

  fromEntityToDTO(entity: CalculationTASEntity): CalculationTASDTO {
    return new CalculationTASDTO({
      id: entity.id,
      year: entity.year,
      month: entity.month,
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
      observations: entity.observations ?? null,
      actualBalanceId: entity.actualBalance.orElse(new NullActualBalance()).id,
    });
  }
}
