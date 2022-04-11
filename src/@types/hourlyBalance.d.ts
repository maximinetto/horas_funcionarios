import { Prisma } from "@prisma/client";

export type HourlyBalanceTAS = Prisma.HourlyBalanceGetPayload<{
  include: {
    hourlyBalanceTAS: true;
  };
}>;
