import { Prisma } from "@prisma/client";
import Official from "entities/Official";
import Repository from "persistence/Repository";

export default interface OfficialRepository
  extends Repository<number, Official> {
  filter(predicate: Prisma.OfficialFindManyArgs): Promise<Official[]>;
}
