import ActualBalance from "creators/actual/types";
import type Entity from "entities/Entity";
import { TypeOfOfficial } from "entities/Official";

export interface HourlyBalanceModel extends Entity {
  id: string;
  year: number;
  type: TypeOfOfficial;
}

export interface HourlyBalanceTASModel extends HourlyBalanceModel {
  working: Decimal;
  simple: Decimal;
  nonWorking: Decimal;
  actualBalance: ActualBalance;
}

export interface HourlyBalanceTeacherModel extends HourlyBalanceModel {
  balance: Decimal;
  actualBalance: ActualBalance;
}
