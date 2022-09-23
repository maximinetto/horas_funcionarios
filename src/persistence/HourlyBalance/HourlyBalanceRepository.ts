import HourlyBalance from "../../entities/HourlyBalance";
import Repository from "../Repository";

export default interface HourlyBalanceRepository
  extends Repository<string, HourlyBalance> {}
