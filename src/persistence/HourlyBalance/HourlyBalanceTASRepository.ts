import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import Repository from "persistence/Repository";

export default interface HourlyBalanceTASRepository
  extends Repository<string, HourlyBalanceTAS> {}
