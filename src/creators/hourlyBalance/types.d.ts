import Decimal from "decimal.js";

import ActualBalance from "../../creators/actual/types";
import type Entity from "../../entities/Entity";
import { TypeOfOfficial } from "../../enums/officials";

export interface HourlyBalanceModel extends Entity {
  id: string;
  year: number;
  type: TypeOfOfficial;
  insert?: boolean;
}

export interface HourlyBalanceTASModel extends HourlyBalanceModel {
  working: Decimal;
  simple: Decimal;
  nonWorking: Decimal;
  actualBalance?: ActualBalance;
}

export interface HourlyBalanceTeacherModel extends HourlyBalanceModel {
  balance: Decimal;
  actualBalance?: ActualBalance;
}
