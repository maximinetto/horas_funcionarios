import Nullable from "@/entities/null_object/Nullable";
import { Month } from "@prisma/client";
import type Decimal from "decimal.js";
import Calculation from "./Calculation";

export default class CalculationTAS extends Calculation implements Nullable {
  private surplusBusiness: Decimal;
  private surplusNonWorking: Decimal;
  private surplusSimple: Decimal;
  private discount: Decimal;
  private workingOvertime: Decimal;
  private workingNightOvertime: Decimal;
  private nonWorkingOvertime: Decimal;
  private nonWorkingNightOvertime: Decimal;
  private compensatedNightOvertime: Decimal;
  private calculationId: string;

  constructor(
    id: string,
    year: number,
    month: Month,
    surplusBusiness: Decimal,
    surplusNonWorking: Decimal,
    surplusSimple: Decimal,
    discount: Decimal,
    workingOvertime: Decimal,
    workingNightOvertime: Decimal,
    nonWorkingOvertime: Decimal,
    nonWorkingNightOvertime: Decimal,
    compensatedNightOvertime: Decimal,
    calculationId: string,
    observations?: string,
    actualBalance?: any
  ) {
    super(id, year, month, observations, actualBalance);
    this.surplusBusiness = surplusBusiness;
    this.surplusNonWorking = surplusNonWorking;
    this.surplusSimple = surplusSimple;
    this.discount = discount;
    this.workingOvertime = workingOvertime;
    this.workingNightOvertime = workingNightOvertime;
    this.nonWorkingOvertime = nonWorkingOvertime;
    this.nonWorkingNightOvertime = nonWorkingNightOvertime;
    this.compensatedNightOvertime = compensatedNightOvertime;
    this.calculationId = calculationId;
  }

  public getSurplusBusiness(): Decimal {
    return this.surplusBusiness;
  }

  public getSurplusNonWorking(): Decimal {
    return this.surplusNonWorking;
  }

  public getSurplusSimple(): Decimal {
    return this.surplusSimple;
  }

  public getDiscount(): Decimal {
    return this.discount;
  }

  public getWorkingOvertime(): Decimal {
    return this.workingOvertime;
  }

  public getWorkingNightOvertime(): Decimal {
    return this.workingNightOvertime;
  }

  public getNonWorkingOvertime(): Decimal {
    return this.nonWorkingOvertime;
  }

  public getNonWorkingNightOvertime(): Decimal {
    return this.nonWorkingNightOvertime;
  }

  public getCompensatedNightOvertime(): Decimal {
    return this.compensatedNightOvertime;
  }

  public getCalculationId(): string {
    return this.calculationId;
  }

  public isDefault(): boolean {
    return false;
  }
}
