import ActualBalance from "entities/ActualBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import { TypeOfOfficial } from "enums/officials";

import { CalculationModel } from "./calculations";
import { MakeOptional } from "./common";
import { HourlyBalanceModel, HourlyBalanceTASNonNull } from "./hourlyBalance";
import { Official } from "./officials";

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

export interface PartialActualBalance
  extends MakeOptional<
    ActualBalanceComplete,
    "calculations" | "hourlyBalances" | "officialId" | "official"
  > {}

export interface ActualBalanceWithHourlyBalances extends ActualBalanceModel {
  hourlyBalances: HourlyBalanceModel[];
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
