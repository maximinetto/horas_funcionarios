import { Prisma } from "@prisma/client";
import ActualBalance from "entities/ActualBalance";
import Repository from "persistence/Repository";

export default interface ActualHourlyBalanceRepository
  extends Repository<string, ActualBalance> {
  filter(predicate: Prisma.ActualBalanceFindManyArgs): Promise<ActualBalance[]>;
}
