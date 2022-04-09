import database from "persistence/persistence.config";

/**
 *
 * @typedef {import("@prisma/client").Prisma.ActualBalanceFindManyArgs} ActualBalanceFindManyArgs
 * @typedef {import("@prisma/client").Prisma.ActualBalance} ActualBalance
 */

export const operations = {
  getBalanceTASBYOfficialIdAndYear: ({ officialId, year }) => {
    return database.$queryRaw`SELECT actual_balance.id as 'id', actual_balance.year as 'year', actual_balance.total as 'total', 
    actual_balance.official_id as 'officialId', 
    hourly_balance.id as 'hourlyBalance.id', hourly_balance.year as 'hourlyBalance.year',  
    hourly_balance.actual_balance_id as 'hourlyBalance.actualBalanceId', 
    hourly_balance_tas.id as 'hourlyBalanceTAS.id', hourly_balance_tas.working as 'hourlyBalanceTAS.working', 
    hourly_balance_tas.non_working as 'hourlyBalanceTAS.nonWorking', 
    hourly_balance_tas.simple as 'hourlyBalanceTAS.simple', hourly_balance_tas.hourly_balance_id as 'hourlyBalanceTas.hourlyBalanceId' 
FROM actual_balance 
INNER JOIN hourly_balance ON hourly_balance.actual_balance_id = actual_balance.id
INNER JOIN hourly_balance_tas ON hourly_balance_id = hourly_balance.id
INNER JOIN (SELECT min(year) as min_year, actual_balance_id 
         FROM hourly_balance as aux, 
            (SELECT (working + non_working + simple) as total, hourly_balance_id FROM hourly_balance_tas ) as hours 
     WHERE hours.hourly_balance_id = aux.id AND hours.total > 0 
     GROUP BY actual_balance_id) min_year ON actual_balance.id = min_year.actual_balance_id

WHERE official_id = ${officialId} AND actual_balance.year = ${year} AND hourly_balance.year >= min_year.min_year
ORDER BY year ASC, hourly_balance.year ASC`.then((balances) =>
      serializeBalancesTAS(balances)
    );
  },
  /**
   *
   * @param {ActualBalanceFindManyArgs} condition
   * @return {Array<ActualBalance>}
   */
  getTAS: (condition) => database.actualBalance.findMany(condition),
};

function serializeBalancesTAS(balances) {
  if (balances == null || !Array.isArray(balances)) {
    throw new Error("balances is not a array");
  }

  const result = [];

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
        total: Number(balance["total"]),
        officialId: Number(balance["officialId"]),
        hourlyBalances: [hourlyBalance],
      });
    }
  }

  return result;
}
