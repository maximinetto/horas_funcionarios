import HourlyBalance from "entities/HourlyBalance";
import MikroORMRepository from "persistence/MikroORMRepository";

import HourlyBalanceRepository from "./HourlyBalanceRepository";

export default class MikroORMHourlyBalanceRepository
  extends MikroORMRepository<string, HourlyBalance>
  implements HourlyBalanceRepository
{
  constructor() {
    super({ modelName: "HourlyBalance" });
  }
}
