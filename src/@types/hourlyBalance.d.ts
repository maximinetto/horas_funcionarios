import { Prisma } from "@prisma/client";

export type HourlyBalanceTAS = Prisma.HourlyBalanceGetPayload<{
  include: {
    hourlyBalanceTAS: true;
  };
}>;

export type HourlyBalanceTeacher = Prisma.HourlyBalanceGetPayload<{
  include: {
    hourlyBalanceTeacher: true;
  };
}>;
