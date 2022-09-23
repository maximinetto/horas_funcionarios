import CalculationTAS from "../../../entities/CalculationTAS";
import Repository from "../../Repository";

export default interface CalculationTASRepository
  extends Repository<string, CalculationTAS> {
  getCalculationsTASWithActualYear({
    officialId,
    year,
  }: {
    officialId: number;
    year: number;
  }): Promise<CalculationTAS[]>;
  getCalculationsTASWithYearGreaterThanActual({
    officialId,
    year,
  }: {
    year: number;
    officialId: number;
  });
}
