import ActualBalance from "../../entities/ActualBalance";
import ActualBalanceTAS from "../../entities/ActualBalanceTAS";
import Repository from "../Repository";

export default interface ActualHourlyBalanceRepository
  extends Repository<string, ActualBalance> {
  getTASWithYearGreaterThanActual(filter: {
    year: number;
    officialId: number;
  }): Promise<ActualBalanceTAS[]>;
}
