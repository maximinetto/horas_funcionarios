import { Prisma } from "@prisma/client";
import HourlyBalance from "entities/HourlyBalance";
import Repository from "persistence/Repository";

export default interface HourlyBalanceRepository
  extends Repository<string, HourlyBalance> {
  filter(predicate: Prisma.HourlyBalanceFindManyArgs): Promise<HourlyBalance[]>;
}
