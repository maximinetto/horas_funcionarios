import Calculation from "entities/Calculation";
import { TypeOfOfficial } from "enums/officials";
import Repository from "persistence/Repository";

export default interface CalculationRepository
  extends Repository<string, Calculation> {
  filter(predicate: object): Promise<Calculation[]>;
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
