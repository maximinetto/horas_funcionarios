export default class CalculationTASDTOWithTimeFieldsInString {
  id: string;
  year: number;
  month: number;
  observations: string | undefined;
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
  }: {
    id: string;
    year: number;
    month: number;
    observations: string | undefined;
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
  }
}
