import CalculationTAS from "entities/CalculationTAS";
import MikroORMRepository from "persistence/MikroORMRepository";

import CalculationTASRepository from "./CalculationTASRepository";

export default class MikroORMCalculationTASRepository
  extends MikroORMRepository<string, CalculationTAS>
  implements CalculationTASRepository
{
  constructor() {
    super({ modelName: "CalculationTAS" });
  }
}
