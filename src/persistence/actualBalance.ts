import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";

import HourlyBalanceTASConverter from "converters/HourlyBalanceTASConverter";
import ActualBalance from "entities/ActualBalance";
import Official from "entities/Official";
import database from "persistence/persistence.config";
import { serializeBalancesTAS } from "serializers/persistence/balance";
import {
  ActualBalanceDTO,
  ActualBalanceFindManyOptions,
  ActualBalanceWithTASEntity,
} from "types/actualBalance";

export class ActualHourlyBalanceRepository {
  private hourlyBalanceConverter: HourlyBalanceTASConverter;
  constructor(hourlyBalanceConverter?: HourlyBalanceTASConverter) {
    this.hourlyBalanceConverter =
      hourlyBalanceConverter || new HourlyBalanceTASConverter();
  }

  getBalanceTASBYOfficialIdAndYear({
    officialId,
    year,
  }: {
    officialId: number;
    year: number;
  }): Promise<ActualBalanceDTO[]> {
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
  }
  getTAS(
    where: Prisma.ActualBalanceWhereInput,
    options?: ActualBalanceFindManyOptions
  ): Promise<ActualBalanceWithTASEntity[]> {
    return database.actualBalance
      .findMany({
        where,
        ...options,
        include: {
          hourlyBalances: {
            include: {
              hourlyBalanceTAS: true,
            },
          },
        },
      })
      .then((actuals) => {
        return actuals.map((balance) => {
          const hourlyBalances =
            this.hourlyBalanceConverter.fromModelsToEntities(
              balance.hourlyBalances
            );

          return new ActualBalance(
            balance.id,
            balance.year,
            new Decimal(balance.total.toString()),
            Official.default(balance.officialId),
            hourlyBalances
          );
        });
      });
  }
}
