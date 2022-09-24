import HourlyBalanceTeacher from "../../entities/HourlyBalanceTeacher";
import MikroORMRepository from "../MikroORMRepository";
import HourlyBalanceRepository from "./HourlyBalanceRepository";

export default class MikroORMHourlyBalanceTeacherRepository
  extends MikroORMRepository<string, HourlyBalanceTeacher>
  implements HourlyBalanceRepository
{
  constructor() {
    super({ modelName: HourlyBalanceTeacher });
  }

  async clear(): Promise<void> {
    await this._mikroorm.em.flush();
    this._mikroorm.em.clear();
    await this._mikroorm.em.nativeDelete(HourlyBalanceTeacher, {});
  }
}
