import Calculation from "entities/Calculation";
import MikroORMRepository from "persistence/MikroORMRepository";

import CalculationRepository from "./CalculationRepository";

export default class MikroORMCalculationRepository
  extends MikroORMRepository<string, Calculation>
  implements CalculationRepository
{
  constructor() {
    super({ modelName: "Calculation" });
  }
}
