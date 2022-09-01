import { Prisma } from "@prisma/client";
import Calculation from "entities/Calculation";
import { TypeOfOfficial } from "entities/Official";
import Repository from "persistence/Repository";

export default interface CalculationRepository
  extends Repository<string, Calculation> {
  filter(predicate: Prisma.CalculationFindManyArgs): Promise<Calculation[]>;
  getCalculationWithYearGreaterThanActual({
    officialId,
    year,
    type,
  }: {
    officialId: number;
    year: number;
    type: TypeOfOfficial;
  }): Promise<Calculation[]>;

  getCalculationsWithActualYear({
    officialId,
    year,
    type,
  }: {
    officialId: number;
    year: number;
    type: TypeOfOfficial;
  }): Promise<Calculation[]>;
}
