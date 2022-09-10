import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import { Month } from "enums/common";

import ActualBalance from "./ActualBalance";
import ActualBalanceTAS from "./ActualBalanceTAS";
import Calculation from "./Calculation";
import type Entity from "./Entity";

interface CalculationTASModel extends Entity {
  id?: string;
  year: number;
  month: Month;
  surplusBusiness: Decimal;
  surplusNonWorking: Decimal;
  surplusSimple: Decimal;
  discount: Decimal;
  workingOvertime: Decimal;
  workingNightOvertime: Decimal;
  nonWorkingOvertime: Decimal;
  nonWorkingNightOvertime: Decimal;
  compensatedNightOvertime: Decimal;
  observations?: string;
  actualBalance?: ActualBalanceTAS;
}

export default class CalculationTAS extends Calculation implements Nullable {
  surplusBusiness!: Decimal;
  surplusNonWorking!: Decimal;
  surplusSimple!: Decimal;
  discount!: Decimal;
  workingOvertime!: Decimal;
  workingNightOvertime!: Decimal;
  nonWorkingOvertime!: Decimal;
  nonWorkingNightOvertime!: Decimal;
  compensatedNightOvertime!: Decimal;
  actualBalance?: ActualBalanceTAS;

  public static WORKING_MULTIPLIER = 1.5;
  public static NON_WORKING_MULTIPLIER = 2;

  constructor({
    actualBalance,
    compensatedNightOvertime,
    discount,
    id,
    month,
    nonWorkingNightOvertime,
    nonWorkingOvertime,
    observations,
    surplusBusiness,
    surplusNonWorking,
    surplusSimple,
    workingNightOvertime,
    workingOvertime,
    year,
    createdAt,
    updatedAt,
  }: CalculationTASModel) {
    super({ id, year, month, observations });
    this.surplusBusiness = surplusBusiness;
    this.surplusNonWorking = surplusNonWorking;
    this.surplusSimple = surplusSimple;
    this.discount = discount;
    this.workingOvertime = workingOvertime;
    this.workingNightOvertime = workingNightOvertime;
    this.nonWorkingOvertime = nonWorkingOvertime;
    this.nonWorkingNightOvertime = nonWorkingNightOvertime;
    this.compensatedNightOvertime = compensatedNightOvertime;
    this.actualBalance = actualBalance;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getTotalHoursPerCalculation(): Decimal {
    return this.surplusBusiness
      .mul(CalculationTAS.WORKING_MULTIPLIER)
      .add(this.surplusNonWorking.mul(CalculationTAS.NON_WORKING_MULTIPLIER))
      .add(this.surplusSimple);
  }

  public discountPerCalculation(): Decimal {
    return this.discount;
  }

  getActualBalance(): ActualBalance | undefined {
    return this.actualBalance;
  }
  setActualBalance(actualBalance: ActualBalanceTAS) {
    this.actualBalance = actualBalance;
  }

  public copy({
    id,
    year,
    month,
    surplusBusiness,
    surplusNonWorking,
    surplusSimple,
    discount,
    workingOvertime,
    workingNightOvertime,
    nonWorkingOvertime,
    nonWorkingNightOvertime,
    compensatedNightOvertime,
    observations,
    actualBalance,
  }: Partial<CalculationTASModel>): CalculationTAS {
    return new CalculationTAS({
      id: id ?? this.id,
      year: year ?? this.year,
      month: month ?? this.month,
      surplusBusiness: surplusBusiness ?? this.surplusBusiness,
      surplusNonWorking: surplusNonWorking ?? this.surplusNonWorking,
      surplusSimple: surplusSimple ?? this.surplusSimple,
      discount: discount ?? this.discount,
      workingOvertime: workingOvertime ?? this.workingOvertime,
      workingNightOvertime: workingNightOvertime ?? this.workingNightOvertime,
      nonWorkingOvertime: nonWorkingOvertime ?? this.nonWorkingOvertime,
      nonWorkingNightOvertime:
        nonWorkingNightOvertime ?? this.nonWorkingNightOvertime,
      compensatedNightOvertime:
        compensatedNightOvertime ?? this.compensatedNightOvertime,
      observations: observations ?? this.observations,
      actualBalance: actualBalance ?? this.actualBalance,
    });
  }
}
