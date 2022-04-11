import { Prisma } from "@prisma/client";

export type ActualBalanceDTO = Prisma.ActualBalanceGetPayload<{
  include: { hourlyBalances: true };
}>;

export type ActualBalanceFindManyOptions = Omit<
  Prisma.ActualBalanceFindManyArgs,
  "where"
>;

export type ActualBalanceWithHourlyBalances = Prisma.ActualBalanceGetPayload<{
  include: { hourlyBalances: true };
}>;

export interface ActualBalanceWithHourlyBalancesOptional
  extends Partial<ActualBalanceWithHourlyBalances> {}
