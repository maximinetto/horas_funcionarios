import Decimal from "decimal.js";

import ActualBalance from "@/entities/ActualBalance";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
import Official from "@/entities/Official";

export function convert(
  hourlyBalancesTAS: HourlyBalanceTAS[],
  official: Official
): ActualBalance {
  const actualBalanceId = hourlyBalancesTAS[0].actualBalance.get().id;
  const year = hourlyBalancesTAS[hourlyBalancesTAS.length - 1].year;
  const total = hourlyBalancesTAS.reduce(
    (acc, { simple, working, nonWorking }) =>
      acc.plus(simple).plus(working).plus(nonWorking),

    new Decimal(0)
  );

  return new ActualBalance(
    actualBalanceId,
    year,
    total,
    official,
    hourlyBalancesTAS
  );
}
