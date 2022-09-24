import { ActualBalanceDTO } from "../../types/actualBalance";

export function serializeBalancesTAS(balances: unknown) {
  if (balances == null || !Array.isArray(balances)) {
    throw new Error("balances is not a array");
  }

  const result: ActualBalanceDTO[] = [];

  for (const balance of balances) {
    const rowFound = result.find((r) => balance.id === r.id);
    const hourlyBalance = {
      id: balance["hourlyBalance.id"],
      year: Number(balance["hourlyBalance.year"]),
      actualBalanceId: balance["hourlyBalance.actualBalanceId"],
      hourlyBalanceTAS: {
        working: BigInt(balance["hourlyBalanceTas.working"]),
        nonWorking: BigInt(balance["hourlyBalanceTas.nonWorking"]),
        simple: BigInt(balance["hourlyBalanceTas.simple"]),
      },
    };
    if (rowFound) {
      rowFound.hourlyBalances.push(hourlyBalance);
    } else {
      result.push({
        id: balance["id"],
        year: Number(balance["year"]),
        total: BigInt(balance["total"]),
        type: balance["type"],
        officialId: Number(balance["officialId"]),
        hourlyBalances: [hourlyBalance],
      });
    }
  }

  return result;
}
