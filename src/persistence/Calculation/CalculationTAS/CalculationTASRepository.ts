import CalculationTAS from "entities/CalculationTAS";
import Repository from "persistence/Repository";

export default interface CalculationTASRepository
  extends Repository<string, CalculationTAS> {}
