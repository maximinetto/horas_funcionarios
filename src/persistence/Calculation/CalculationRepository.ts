import { Prisma, TypeOfOfficials } from "@prisma/client";
import Calculation from "entities/Calculation";
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
    type: TypeOfOfficials;
  }): Promise<Calculation[]>;

  getCalculationsWithActualYear({
    officialId,
    year,
    type,
  }: {
    officialId: number;
    year: number;
    type: TypeOfOfficials;
  }): Promise<Calculation[]>;
}
