import CalculationTAS from "../../../../entities/CalculationTAS";
import CalculationCreator from "../../../../services/calculations/classes/CalculationCreator";

export default class CalculationTASCreator implements CalculationCreator {
  create(calculation: CalculationTAS, id: string): CalculationTAS {
    calculation.id = id;
    return calculation;
  }
}
