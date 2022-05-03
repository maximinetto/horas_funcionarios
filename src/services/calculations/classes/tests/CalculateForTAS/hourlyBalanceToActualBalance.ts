import { ActualBalance, HourlyBalance, HourlyBalanceTAS } from "@prisma/client";
import { HourlyBalanceTASNotNullable } from "./types";

export function convert(
  hourlyBalancesTAS: HourlyBalanceTASNotNullable[],
  officialId: number
): ActualBalance & {
  hourlyBalances: (HourlyBalance & {
    hourlyBalanceTAS: HourlyBalanceTAS;
  })[];
} {
  const actualBalanceId = hourlyBalancesTAS[0].actualBalanceId;
  const year = hourlyBalancesTAS[hourlyBalancesTAS.length - 1].year;

  return {
    id: actualBalanceId,
    year: year,
    total: hourlyBalancesTAS.reduce(
      (acc, { hourlyBalanceTAS }) =>
        acc +
        hourlyBalanceTAS.simple +
        hourlyBalanceTAS.working +
        hourlyBalanceTAS.nonWorking,
      0n
    ),
    officialId,
    hourlyBalances: hourlyBalancesTAS.map((hourlyBalanceTAS) => ({
      id: hourlyBalanceTAS.id,
      year: hourlyBalanceTAS.year,
      hourlyBalanceTAS: {
        ...hourlyBalanceTAS.hourlyBalanceTAS,
      },
      actualBalanceId,
    })),
  };
}
