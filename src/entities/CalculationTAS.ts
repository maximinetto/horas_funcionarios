import { Month } from "@prisma/client";
import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalanceTAS from "./ActualBalanceTAS";
import Calculation from "./Calculation";
import type Entity from "./Entity";

interface CalculationTASModel extends Entity {
  id: string;
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
  private _surplusBusiness: Decimal;
  private _surplusNonWorking: Decimal;
  private _surplusSimple: Decimal;
  private _discount: Decimal;
  private _workingOvertime: Decimal;
  private _workingNightOvertime: Decimal;
  private _nonWorkingOvertime: Decimal;
  private _nonWorkingNightOvertime: Decimal;
  private _compensatedNightOvertime: Decimal;
  private _actualBalance?: ActualBalanceTAS;

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
    this._surplusBusiness = surplusBusiness;
    this._surplusNonWorking = surplusNonWorking;
    this._surplusSimple = surplusSimple;
    this._discount = discount;
    this._workingOvertime = workingOvertime;
    this._workingNightOvertime = workingNightOvertime;
    this._nonWorkingOvertime = nonWorkingOvertime;
    this._nonWorkingNightOvertime = nonWorkingNightOvertime;
    this._compensatedNightOvertime = compensatedNightOvertime;
    this._actualBalance = actualBalance;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public get surplusBusiness(): Decimal {
    return this._surplusBusiness;
  }

  public set surplusBusiness(value: Decimal) {
    this._surplusBusiness = value;
  }

  public get surplusNonWorking(): Decimal {
    return this._surplusNonWorking;
  }

  public set surplusNonWorking(value: Decimal) {
    this._surplusNonWorking = value;
  }

  public get surplusSimple(): Decimal {
    return this._surplusSimple;
  }

  public set surplusSimple(value: Decimal) {
    this._surplusSimple = value;
  }

  public get discount(): Decimal {
    return this._discount;
  }

  public set discount(value: Decimal) {
    this._discount = value;
  }

  public get workingOvertime(): Decimal {
    return this._workingOvertime;
  }

  public set workingOvertime(value: Decimal) {
    this._workingOvertime = value;
  }

  public get workingNightOvertime(): Decimal {
    return this._workingNightOvertime;
  }

  public set workingNightOvertime(value: Decimal) {
    this._workingNightOvertime = value;
  }

  public get nonWorkingOvertime(): Decimal {
    return this._nonWorkingOvertime;
  }

  public set nonWorkingOvertime(value: Decimal) {
    this._nonWorkingOvertime = value;
  }

  public get nonWorkingNightOvertime(): Decimal {
    return this._nonWorkingNightOvertime;
  }

  public set nonWorkingNightOvertime(value: Decimal) {
    this._nonWorkingNightOvertime = value;
  }

  public get compensatedNightOvertime(): Decimal {
    return this._compensatedNightOvertime;
  }

  public set compensatedNightOvertime(value: Decimal) {
    this._compensatedNightOvertime = value;
  }

  public get actualBalance(): ActualBalanceTAS | undefined {
    return this._actualBalance;
  }

  public set actualBalance(actualBalance: ActualBalanceTAS | undefined) {
    this._actualBalance = actualBalance;
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
