import ActualBalance from "entities/ActualBalance";

import { CalculationModel } from "./calculations";
import {
  HourlyBalanceModel,
  HourlyBalanceSimple,
  HourlyBalanceTASNonNull,
} from "./hourlyBalance";
import { Official, OfficialSimple } from "./officials";

export interface ActualBalanceModel {
  id: string;
  year: number;
  total: bigint;
  type: TypeOfOfficial;
  officialId?: number;
}

export interface ActualBalanceDTO extends ActualBalanceModel {
  hourlyBalances: HourlyBalanceModel[];
}

export interface ActualBalanceComplete extends ActualBalanceModel {
  calculations: CalculationModel[];
  hourlyBalances: HourlyBalanceModel[];
  official: Official;
}

export interface PartialActualBalance extends ActualBalanceComplete {
  calculations?;
  hourlyBalances?;
  official?;
  officialId?: number;
}

export interface ActualBalanceWithHourlyBalances extends ActualBalanceModel {
  hourlyBalances: HourlyBalanceModel[];
}

export interface ActualBalanceWithHourlyBalancesSimple
  extends Omit<ActualBalanceWithHourlyBalances, "officialId"> {
  total: bigint;
  official: Optional<OfficialSimple>;
  hourlyBalances: HourlyBalanceSimple[];
}

export interface ActualBalanceWithHourlyBalancesTAS
  extends ActualBalanceWithHourlyBalances {
  hourlyBalances: HourlyBalanceTASNonNull[];
}
export interface ActualBalanceWithHourlyBalancesOptional
  extends Partial<ActualBalanceWithHourlyBalances> {}

export interface ActualBalanceWithHourlyBalancesTASOptional
  extends Partial<ActualBalanceWithHourlyBalancesTAS> {}

export interface ActualBalanceWithTASEntity extends ActualBalance {
  hourlyBalances: HourlyBalanceTAS[];
}
