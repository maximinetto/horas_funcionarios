import { Prisma } from "@prisma/client";
import { Decimal } from "decimal.js";
import ActualBalance from "entities/ActualBalance";

import { HourlyBalanceSimple, HourlyBalanceTASNonNull } from "./hourlyBalance";
import { OfficialSimple } from "./officials";

export type ActualBalanceDTO = Prisma.ActualBalanceGetPayload<{
  include: { hourlyBalances: true };
}>;

export type ActualBalanceComplete = Prisma.ActualBalanceGetPayload<{
  include: {
    calculations: true;
    hourlyBalances: true;
    official: true;
  };
}>;

export interface PartialActualBalance extends ActualBalanceComplete {
  calculations?;
  hourlyBalances?;
  official?;
}

export type ActualBalanceFindManyOptions = Omit<
  Prisma.ActualBalanceFindManyArgs,
  "where"
>;

export type ActualBalanceWithHourlyBalances = Prisma.ActualBalanceGetPayload<{
  include: { hourlyBalances: true };
}>;

export interface ActualBalanceWithHourlyBalancesSimple
  extends Omit<ActualBalanceWithHourlyBalances, "officialId"> {
  total: Decimal;
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
