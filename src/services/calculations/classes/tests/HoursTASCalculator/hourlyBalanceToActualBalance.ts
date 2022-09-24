import Decimal from "decimal.js";

import ActualBalance from "../../../../../entities/ActualBalance";
import ActualBalanceTAS from "../../../../../entities/ActualBalanceTAS";
import HourlyBalanceTAS from "../../../../../entities/HourlyBalanceTAS";
import Official from "../../../../../entities/Official";
import { generateRandomUUIDV4 } from "../../../../../utils/strings";

export function convert(
  hourlyBalancesTAS: HourlyBalanceTAS[],
  official: Official
): ActualBalance {
  const actualBalanceId = hourlyBalancesTAS[0].actualBalance
    ? hourlyBalancesTAS[0].actualBalance.id
    : generateRandomUUIDV4();

  const year = hourlyBalancesTAS[hourlyBalancesTAS.length - 1].year;
  const total = hourlyBalancesTAS.reduce(
    (acc, { simple, working, nonWorking }) =>
      acc.plus(simple).plus(working).plus(nonWorking),

    new Decimal(0)
  );

  return new ActualBalanceTAS({
    id: actualBalanceId,
    year,
    total,
    official,
    hourlyBalances: hourlyBalancesTAS,
  });
}
