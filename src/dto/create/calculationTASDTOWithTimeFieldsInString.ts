export default class CalculationTASDTOWithTimeFieldsInString {
  private _id: string;
  private _year: number;
  private _month: number;
  private _observations: string | null;
  private _actualBalanceId: string;
  private _surplusBusiness: string;
  private _surplusNonWorking: string;
  private _surplusSimple: string;
  private _discount: string;
  private _workingOvertime: string;
  private _workingNightOvertime: string;
  private _nonWorkingOvertime: string;
  private _nonWorkingNightOvertime: string;
  private _compensatedNightOvertime: string;
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
    month: number;
    observations: string | null;
    actualBalanceId: string;
    surplusBusiness: string;
    surplusNonWorking: string;
    surplusSimple: string;
    discount: string;
    workingOvertime: string;
    workingNightOvertime: string;
    nonWorkingOvertime: string;
    nonWorkingNightOvertime: string;
    compensatedNightOvertime: string;
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
  get month(): number {
    return this._month;
  }
  get observations(): string | null {
    return this._observations;
  }
  get actualBalanceId(): string {
    return this._actualBalanceId;
  }
  get surplusBusiness(): string {
    return this._surplusBusiness;
  }
  get surplusNonWorking(): string {
    return this._surplusNonWorking;
  }
  get surplusSimple(): string {
    return this._surplusSimple;
  }
  get discount(): string {
    return this._discount;
  }
  get workingOvertime(): string {
    return this._workingOvertime;
  }
  get workingNightOvertime(): string {
    return this._workingNightOvertime;
  }
  get nonWorkingOvertime(): string {
    return this._nonWorkingOvertime;
  }
  get nonWorkingNightOvertime(): string {
    return this._nonWorkingNightOvertime;
  }
  get compensatedNightOvertime(): string {
    return this._compensatedNightOvertime;
  }
  get calculationId(): string {
    return this._calculationId;
  }
}
