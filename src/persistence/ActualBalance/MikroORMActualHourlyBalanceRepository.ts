import ActualBalance from "../../entities/ActualBalance";
import ActualBalanceTAS from "../../entities/ActualBalanceTAS";
import { serializeBalancesTAS } from "../../serializers/persistence/balance";
import { ActualBalanceDTO } from "../../types/actualBalance";
import ActualHourlyBalanceRepository from "../ActualBalance/ActualHourlyBalanceRepository";
import MikroORMRepository from "../MikroORMRepository";

export default class MikroORMActualHourlyBalanceRepository
  extends MikroORMRepository<string, ActualBalance>
  implements ActualHourlyBalanceRepository
{
  constructor() {
    super({ modelName: ActualBalance });
  }

  getBalanceTASBYOfficialIdAndYear({
    officialId,
    year,
  }: {
    officialId: number;
    year: number;
  }): Promise<ActualBalanceDTO[]> {
    return this._mikroorm.em
      .execute(
        `SELECT actual_balance.id as 'id', actual_balance.year as 'year', actual_balance.total as 'total', 
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

WHERE official_id = ? AND actual_balance.year = ? AND hourly_balance.year >= min_year.min_year
ORDER BY year ASC, hourly_balance.year ASC`,
        [officialId, year]
      )
      .then((balances) => serializeBalancesTAS(balances));
  }

  getTAS(): Promise<ActualBalance[]> {
    return this._mikroorm.em.find(
      ActualBalanceTAS,
      {},
      {
        populate: ["hourlyBalances"],
      }
    );
  }

  getTASWithYearGreaterThanActual({
    year,
    officialId,
  }: {
    year: number;
    officialId: number;
  }) {
    return this._mikroorm.em.find(
      ActualBalanceTAS,
      {
        year: {
          $gte: year,
        },
        official: {
          id: officialId,
        },
      },
      {
        populate: ["hourlyBalances"],
      }
    );
  }

  async removeRange(entities: ActualBalance[]): Promise<ActualBalance[]> {
    this._mikroorm.em.remove(entities);
    return entities;
  }

  async clear(): Promise<void> {
    await this._mikroorm.em.flush();
    this._mikroorm.em.clear();
    await this._mikroorm.em.nativeDelete(ActualBalance, {});
  }
}
