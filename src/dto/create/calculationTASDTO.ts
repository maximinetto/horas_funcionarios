import { Month } from "@prisma/client";
import { CalculationTAS } from "types/calculations";

export default class CalculationTASDTO implements CalculationTAS {
  private _id: string;
  private _year: number;
  private _month: Month;
  private _observations: string | null;
  private _actualBalanceId: string;
  private _surplusBusiness: bigint;
  private _surplusNonWorking: bigint;
  private _surplusSimple: bigint;
  private _discount: bigint;
  private _workingOvertime: bigint;
  private _workingNightOvertime: bigint;
  private _nonWorkingOvertime: bigint;
  private _nonWorkingNightOvertime: bigint;
  private _compensatedNightOvertime: bigint;
  private _calculationId: string;

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
    calculationId,
  }: {
    id: string;
    year: number;
    month: Month;
    observations: string | null;
    actualBalanceId: string;
    surplusBusiness: bigint;
    surplusNonWorking: bigint;
    surplusSimple: bigint;
    discount: bigint;
    workingOvertime: bigint;
    workingNightOvertime: bigint;
    nonWorkingOvertime: bigint;
    nonWorkingNightOvertime: bigint;
    compensatedNightOvertime: bigint;
    calculationId: string;
  }) {
    this._id = id;
    this._year = year;
    this._month = month;
    this._observations = observations;
    this._actualBalanceId = actualBalanceId;
    this._surplusBusiness = surplusBusiness;
    this._surplusNonWorking = surplusNonWorking;
    this._surplusSimple = surplusSimple;
    this._discount = discount;
    this._workingOvertime = workingOvertime;
    this._workingNightOvertime = workingNightOvertime;
    this._nonWorkingOvertime = nonWorkingOvertime;
    this._nonWorkingNightOvertime = nonWorkingNightOvertime;
    this._compensatedNightOvertime = compensatedNightOvertime;
    this._calculationId = calculationId;
  }

  get id(): string {
    return this._id;
  }
  get year(): number {
    return this._year;
  }
  get month(): Month {
    return this._month;
  }
  get observations(): string | null {
    return this._observations;
  }
  get actualBalanceId(): string {
    return this._actualBalanceId;
  }
  get surplusBusiness(): bigint {
    return this._surplusBusiness;
  }
  get surplusNonWorking(): bigint {
    return this._surplusNonWorking;
  }
  get surplusSimple(): bigint {
    return this._surplusSimple;
  }
  get discount(): bigint {
    return this._discount;
  }
  get workingOvertime(): bigint {
    return this._workingOvertime;
  }
  get workingNightOvertime(): bigint {
    return this._workingNightOvertime;
  }
  get nonWorkingOvertime(): bigint {
    return this._nonWorkingOvertime;
  }
  get nonWorkingNightOvertime(): bigint {
    return this._nonWorkingNightOvertime;
  }
  get compensatedNightOvertime(): bigint {
    return this._compensatedNightOvertime;
  }
  get calculationId(): string {
    return this._calculationId;
  }
}
