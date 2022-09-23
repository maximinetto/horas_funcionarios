import CalculationTeacher from "../../../entities/CalculationTeacher";
import Repository from "../../Repository";

export default interface CalculationTeacherRepository
  extends Repository<string, CalculationTeacher> {
  getCalculationsTeacherWithYearGreaterThanActual(arg0: {
    officialId: number;
    year: number;
  }): Promise<CalculationTeacher[]>;
  getCalculationsTeacherWithActualYear(arg0: {
    officialId: number;
    year: number;
  }): Promise<CalculationTeacher[]>;
}
