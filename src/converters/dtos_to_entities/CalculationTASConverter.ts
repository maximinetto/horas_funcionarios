import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import { Decimal } from "decimal.js";
import CalculationTASDTO from "dto/create/calculationTASDTO";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import CalculationTASEntity from "entities/CalculationTAS";

import { AbstractConverter } from "./AbstractConverter";

export default class CalculationTASConverter extends AbstractConverter<
  CalculationTASEntity,
  CalculationTASDTO
> {
  private _actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;

  constructor({
    actualHourlyBalanceBuilder,
  }: {
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  }) {
    super();
    this._actualHourlyBalanceBuilder = actualHourlyBalanceBuilder;
  }

  fromDTOToEntity(dto: CalculationTASDTO): CalculationTASEntity {
    return new CalculationTASEntity({
      id: dto.id,
      year: dto.year,
      month: dto.month,
      surplusBusiness: new Decimal(dto.surplusBusiness.toString()),
      surplusNonWorking: new Decimal(dto.surplusNonWorking.toString()),
      surplusSimple: new Decimal(dto.surplusSimple.toString()),
      discount: new Decimal(dto.discount.toString()),
      workingOvertime: new Decimal(dto.workingOvertime.toString()),
      workingNightOvertime: new Decimal(dto.workingNightOvertime.toString()),
      nonWorkingOvertime: new Decimal(dto.nonWorkingOvertime.toString()),
      nonWorkingNightOvertime: new Decimal(
        dto.nonWorkingNightOvertime.toString()
      ),
      compensatedNightOvertime: new Decimal(
        dto.compensatedNightOvertime.toString()
      ),
      observations: dto.observations ?? undefined,
      actualBalance: dto.actualBalanceId
        ? this.actualBalance({
            actualBalanceId: dto.actualBalanceId,
            year: dto.year,
          })
        : undefined,
    });
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
      observations: entity.observations ?? null,
      actualBalanceId: entity.actualBalance?.id,
    });
  }

  private actualBalance({
    actualBalanceId,
    year,
  }: {
    actualBalanceId: string;
    year: number;
  }): ActualBalanceTAS {
    return this._actualHourlyBalanceBuilder.create({
      id: actualBalanceId,
      year: year,
      total: new Decimal(0),
      type: "tas",
    }) as ActualBalanceTAS;
  }
}
