import CalculationTeacher from "entities/CalculationTeacher";
import MikroORMRepository from "persistence/MikroORMRepository";

import CalculationTeacherRepository from "./CalculationTeacherRepository";

export default class MikroORMCalculationTeacherRepository
  extends MikroORMRepository<string, CalculationTeacher>
  implements CalculationTeacherRepository
{
  constructor() {
    super({ modelName: "CalculationTeacher" });
  }
}
