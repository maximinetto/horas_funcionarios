import { Prisma, PrismaClient } from "@prisma/client";
import ActualBalanceConverter from "converters/models_to_entities/ActualBalanceConverter";
import ActualBalance from "entities/ActualBalance";
import ActualHourlyBalanceRepository from "persistence/ActualBalance/ActualHourlyBalanceRepository";
import PrismaRepository from "persistence/PrismaRepository";
import { serializeBalancesTAS } from "serializers/persistence/balance";
import {
  ActualBalanceDTO,
  ActualBalanceFindManyOptions,
  ActualBalanceWithTASEntity,
} from "types/actualBalance";

export default class PrismaActualHourlyBalanceRepository
  extends PrismaRepository<string, ActualBalance>
  implements ActualHourlyBalanceRepository
{
  private actualBalanceConverter: ActualBalanceConverter;

  constructor({
    database,
    actualBalanceConverter,
  }: {
    database: PrismaClient;
    actualBalanceConverter: ActualBalanceConverter;
  }) {
    super({ database, modelName: "actualBalance" });
    this.actualBalanceConverter = actualBalanceConverter;
  }

  toEntity(value: any): ActualBalance {
    return this.actualBalanceConverter.fromModelToEntity(value);
  }

  toModel(value: ActualBalance): object {
    return this.actualBalanceConverter.fromEntityToModel(value);
  }

  getBalanceTASBYOfficialIdAndYear({
    officialId,
    year,
  }: {
    officialId: number;
    year: number;
  }): Promise<ActualBalanceDTO[]> {
    return this._prisma
      .$queryRaw`SELECT actual_balance.id as 'id', actual_balance.year as 'year', actual_balance.total as 'total', 
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
    return this._prisma.actualBalance
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
        return this.actualBalanceConverter.fromModelsToEntities(actuals);
      });
  }
}
