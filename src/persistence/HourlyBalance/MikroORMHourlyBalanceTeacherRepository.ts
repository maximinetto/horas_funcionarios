import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import MikroORMRepository from "persistence/MikroORMRepository";

import HourlyBalanceRepository from "./HourlyBalanceRepository";

export default class MikroORMHourlyBalanceTeacherRepository
  extends MikroORMRepository<string, HourlyBalanceTeacher>
  implements HourlyBalanceRepository
{
  constructor() {
    super({ modelName: "HourlyBalanceTeacher" });
  }
}
