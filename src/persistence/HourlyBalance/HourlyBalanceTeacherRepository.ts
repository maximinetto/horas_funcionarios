import HourlyBalanceTeacher from "../../entities/HourlyBalanceTeacher";
import Repository from "../Repository";

export default interface HourlyBalanceTeacherRepository
  extends Repository<string, HourlyBalanceTeacher> {}
