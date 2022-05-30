import Nullable from "@/entities/null_object/Nullable";
import { Month } from "@prisma/client";
import { Decimal } from "decimal.js";
import ActualBalance from "./ActualBalance";
import Calculation from "./Calculation";

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
  private _calculationId: string;

  public static WORKING_MULTIPLIER = 1.5;
  public static NON_WORKING_MULTIPLIER = 2;

  public static from({
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
    calculationId,
    observations,
    actualBalance,
  }: {
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
    calculationId: string;
    observations?: string;
    actualBalance: ActualBalance;
  }): CalculationTAS {
    return new CalculationTAS(
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
      calculationId,
      observations,
      actualBalance
    );
  }

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
    actualBalance?: ActualBalance
  ) {
    super(id, year, month, observations, actualBalance);
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

  public get surplusBusiness(): Decimal {
    return this._surplusBusiness;
  }

  public get surplusNonWorking(): Decimal {
    return this._surplusNonWorking;
  }

  public get surplusSimple(): Decimal {
    return this._surplusSimple;
  }

  public get discount(): Decimal {
    return this._discount;
  }

  public get workingOvertime(): Decimal {
    return this._workingOvertime;
  }

  public get workingNightOvertime(): Decimal {
    return this._workingNightOvertime;
  }

  public get nonWorkingOvertime(): Decimal {
    return this._nonWorkingOvertime;
  }

  public get nonWorkingNightOvertime(): Decimal {
    return this._nonWorkingNightOvertime;
  }

  public get compensatedNightOvertime(): Decimal {
    return this._compensatedNightOvertime;
  }

  public get calculationId(): string {
    return this._calculationId;
  }

  public getTotalHoursPerCalculation(): Decimal {
    return this.surplusBusiness
      .mul(CalculationTAS.WORKING_MULTIPLIER)
      .add(this.surplusNonWorking.mul(CalculationTAS.NON_WORKING_MULTIPLIER))
      .add(this.surplusSimple);
  }

  public isDefault(): boolean {
    return false;
  }
}
