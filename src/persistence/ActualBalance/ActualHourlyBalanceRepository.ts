import ActualBalance from "entities/ActualBalance";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import Repository from "persistence/Repository";

export default interface ActualHourlyBalanceRepository
  extends Repository<string, ActualBalance> {
  filter(predicate): Promise<ActualBalance[]>;
  getTASWithYearGreaterThanActual(filter: {
    year: number;
    officialId: number;
  }): Promise<ActualBalanceTAS[]>;
}
