import HourlyBalanceTAS from "../../entities/HourlyBalanceTAS";
import MikroORMRepository from "../MikroORMRepository";
import HourlyBalanceRepository from "./HourlyBalanceRepository";

export default class MikroORMHourlyBalanceTASRepository
  extends MikroORMRepository<string, HourlyBalanceTAS>
  implements HourlyBalanceRepository
{
  constructor() {
    super({ modelName: "HourlyBalanceTAS" });
  }
}
