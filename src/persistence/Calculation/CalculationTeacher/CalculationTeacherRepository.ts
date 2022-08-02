import CalculationTeacher from "entities/CalculationTeacher";
import Repository from "persistence/Repository";

export default interface CalculationTeacherRepository
  extends Repository<string, CalculationTeacher> {}
