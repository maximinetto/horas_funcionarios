import HourlyBalance from "entities/HourlyBalance";

import sort from "./HourlyBalancesSorter";

export function removeHourlyBalancesWithZeroBalance(
  hourlyBalances: HourlyBalance[]
) {
  if (hourlyBalances.length === 0) {
    return hourlyBalances;
  }

  let copy = hourlyBalances.map((value) => value);

  copy = sort(copy);

  const years = copy.map((value) => value.year);

  for (const year of years) {
    const hourlyBalance = copy.find((value) => value.year === year)!;
    const firstBalance: HourlyBalance = copy[0];
    const isTheSame =
      hourlyBalance.calculateTotal().eq(0) &&
      firstBalance.id === hourlyBalance.id;
    if (isTheSame) copy.shift();
  }

  return copy;
}
