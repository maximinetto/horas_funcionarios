import { Decimal } from "decimal.js";

import ActualHourlyBalanceBuilder from "../../creators/actual/ActualHourlyBalanceBuilder";
import CalculationBuilder from "../../creators/calculation/CalculationBuilder";
import CalculationTASDTO from "../../dto/create/CalculationTASDTO";
import ActualBalanceTAS from "../../entities/ActualBalanceTAS";
import CalculationTASEntity from "../../entities/CalculationTAS";
import { TypeOfOfficial } from "../../enums/officials";
import { AbstractConverter } from "./AbstractConverter";

export default class CalculationTASConverter extends AbstractConverter<
  CalculationTASEntity,
  CalculationTASDTO
> {
  private _actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  private _calculationBuilder: CalculationBuilder;

  constructor({
    actualHourlyBalanceBuilder,
    calculationBuilder,
  }: {
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
    calculationBuilder: CalculationBuilder;
  }) {
    super();
    this._actualHourlyBalanceBuilder = actualHourlyBalanceBuilder;
    this._calculationBuilder = calculationBuilder;
    this.fromDTOToEntity = this.fromDTOToEntity.bind(this);
  }

  fromDTOToEntity(dto: CalculationTASDTO): CalculationTASEntity {
    const observations = dto.observations ? dto.observations : undefined;

    return this._calculationBuilder.createTAS({
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
      observations,
      type: TypeOfOfficial.TAS,
      insert: dto.insert,
      actualBalance: {
        id: dto.actualBalanceId,
        year: dto.year,
        total: new Decimal(0),
        type: TypeOfOfficial.TAS,
      },
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
      observations: entity.observations,
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
      type: TypeOfOfficial.TAS,
    }) as ActualBalanceTAS;
  }
}
