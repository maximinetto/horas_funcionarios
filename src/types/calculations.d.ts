import Decimal from "decimal.js";

import Calculations from "../collections/Calculations";
import Calculation from "../entities/Calculation";
import CalculationTASEntity from "../entities/CalculationTAS";
import HourlyBalance from "../entities/HourlyBalance";
import Official from "../entities/Official";
import { Month } from "../enums/common";
import {
  TypeOfHourDecimal,
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "./typeOfHours";

export interface CalculationModel {
  id?: string;
  year: number;
  month: Month;
  observations: string | null;
  actualBalanceId?: string;
}

export interface CalculationTASModel {
  id?: string;
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
}

export interface CalculationTeacherModel {
  id?: string;
  surplus: bigint;
  discount: bigint;
  calculationId: string;
}

export interface CalculationWithTAS extends CalculationModel {
  calculationTAS: CalculationTASModel;
}

export interface NotNullableCalculationWithTAS extends CalculationWithTAS {
  calculationTAS: CalculationTASModel;
}
export interface CalculationWithTeacher extends CalculationModel {
  calculationTeacher: CalculationTeacherModel;
}

export type CalculationTASInherited = CalculationModel &
  Omit<CalculationTASModel, "calculationId">;
export type CalculationTeacherInherited = CalculationModel &
  Omit<CalculationTeacherModel, "calculationId">;

export interface NotNullableCalculationWithTeacher
  extends CalculationWithTeacher {
  calculationTeacher: CalculationTeacherModel;
}

export interface CalculationParam<T extends Calculation> {
  calculations: Calculations<T>;
  year: number;
  official: Official;
  hourlyBalances: HourlyBalance[];
  calculationsFromPersistence: Calculations<T>;
}

export interface CalculationTAS extends CalculationModel, CalculationTASModel {}
export interface CalculationTeacher
  extends CalculationModel,
    CalculationTeacherModel {}

export type CalculationCalculated = {
  calculations: CalculationTASEntity[];
  totalBalance: Decimal;
  totalWorkingHours: TypeOfHourDecimal;
  totalNonWorkingHours: TypeOfHourDecimal;
  totalSimpleHours: TypeOfHourDecimal;
  totalDiscount: Decimal;
  balances: TypeOfHoursByYear[];
  balancesSanitized: TypeOfHoursByYearDecimal[];
};
