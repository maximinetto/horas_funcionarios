import Decimal from "decimal.js";
import { CalculationTASModel } from "entities/CalculationTAS";
import { Month } from "enums/common";

export default class CalculationTASDTO {
  id: string;
  year: number;
  month: Month;
  observations: string | undefined;
  actualBalanceId: string | undefined;
  surplusBusiness: bigint;
  surplusNonWorking: bigint;
  surplusSimple: bigint;
  discount: bigint;
  workingOvertime: bigint;
  workingNightOvertime: bigint;
  nonWorkingOvertime: bigint;
  nonWorkingNightOvertime: bigint;
  compensatedNightOvertime: bigint;
  insert: boolean;

  constructor({
    id,
    year,
    month,
    observations,
    actualBalanceId,
    surplusBusiness,
    surplusNonWorking,
    surplusSimple,
    discount,
    workingOvertime,
    workingNightOvertime,
    nonWorkingOvertime,
    nonWorkingNightOvertime,
    compensatedNightOvertime,
    insert,
  }: {
    id: string;
    year: number;
    month: Month;
    observations: string | undefined;
    actualBalanceId: string | undefined;
    surplusBusiness: bigint;
    surplusNonWorking: bigint;
    surplusSimple: bigint;
    discount: bigint;
    workingOvertime: bigint;
    workingNightOvertime: bigint;
    nonWorkingOvertime: bigint;
    nonWorkingNightOvertime: bigint;
    compensatedNightOvertime: bigint;
    insert?: boolean;
  }) {
    this.id = id;
    this.year = year;
    this.month = month;
    this.observations = observations;
    this.actualBalanceId = actualBalanceId;
    this.surplusBusiness = surplusBusiness;
    this.surplusNonWorking = surplusNonWorking;
    this.surplusSimple = surplusSimple;
    this.discount = discount;
    this.workingOvertime = workingOvertime;
    this.workingNightOvertime = workingNightOvertime;
    this.nonWorkingOvertime = nonWorkingOvertime;
    this.nonWorkingNightOvertime = nonWorkingNightOvertime;
    this.compensatedNightOvertime = compensatedNightOvertime;
    this.insert = insert ?? true;
  }

  toModel(): CalculationTASModel {
    const {
      id,
      year,
      month,
      observations,
      compensatedNightOvertime,
      discount,
      surplusSimple,
      surplusBusiness,
      surplusNonWorking,
      workingNightOvertime,
      workingOvertime,
      nonWorkingNightOvertime,
      nonWorkingOvertime,
    } = this;

    return {
      id,
      year,
      month,
      observations,
      surplusSimple: new Decimal(surplusSimple.toString()),
      surplusBusiness: new Decimal(surplusBusiness.toString()),
      surplusNonWorking: new Decimal(surplusNonWorking.toString()),
      compensatedNightOvertime: new Decimal(
        compensatedNightOvertime.toString()
      ),
      discount: new Decimal(discount.toString()),
      nonWorkingNightOvertime: new Decimal(nonWorkingNightOvertime.toString()),
      nonWorkingOvertime: new Decimal(nonWorkingOvertime.toString()),
      workingNightOvertime: new Decimal(workingNightOvertime.toString()),
      workingOvertime: new Decimal(workingOvertime.toString()),
    };
  }
}
