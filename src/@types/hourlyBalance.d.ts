import {
  HourlyBalanceTAS as HourlyBalanceTASModel,
  Prisma,
} from "@prisma/client";
import { Optional } from "typescript-optional";

import { ActualBalanceWithHourlyBalancesSimple } from "./actualBalance";

export type HourlyBalanceTAS = Prisma.HourlyBalanceGetPayload<{
  include: {
    hourlyBalanceTAS: true;
  };
}>;

export interface HourlyBalanceTASNonNull extends HourlyBalanceTAS {
  hourlyBalanceTAS: HourlyBalanceTASModel;
}

export type HourlyBalanceTeacher = Prisma.HourlyBalanceGetPayload<{
  include: {
    hourlyBalanceTeacher: true;
  };
}>;

export interface HourlyBalanceSimple
  extends Omit<Prisma.HourlyBalanceGetPayload<{}>, "actualBalanceId"> {
  actualBalance: Optional<ActualBalanceWithHourlyBalancesSimple>;
}
