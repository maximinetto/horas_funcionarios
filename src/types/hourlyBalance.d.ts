import { Optional } from "typescript-optional";

import { ActualBalanceWithHourlyBalancesSimple } from "./actualBalance";

export interface HourlyBalanceModel {
  id?: string;
  year: number;
  actualBalanceId?: string;
}

export interface HourlyBalanceTASModel {
  id: string;
  working: bigint;
  nonWorking: bigint;
  simple: bigint;
  hourlyBalanceId?: string;
}

export interface HourlyBalanceTeacherModel {
  id: string;
  balance: bigint;
  hourlyBalanceId?: string;
}

export interface HourlyBalanceTAS extends HourlyBalanceModel {
  hourlyBalanceTAS: HourlyBalanceTASModel;
}

export interface HourlyBalanceTASNonNull extends HourlyBalanceTAS {
  hourlyBalanceTAS: HourlyBalanceTASModel;
}

export interface HourlyBalanceTeacher extends HourlyBalanceModel {
  hourlyBalanceTeacher: HourlyBalanceTeacherModel;
}

export interface HourlyBalanceSimple
  extends Omit<HourlyBalanceModel, "actualBalanceId"> {
  actualBalance: Optional<ActualBalanceWithHourlyBalancesSimple>;
}
