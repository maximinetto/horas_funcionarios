import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import Repository from "persistence/Repository";

export default interface HourlyBalanceTeacherRepository
  extends Repository<string, HourlyBalanceTeacher> {}
