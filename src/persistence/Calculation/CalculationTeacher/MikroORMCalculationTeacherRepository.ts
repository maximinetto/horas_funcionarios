import CalculationTeacher from "../../../entities/CalculationTeacher";
import MikroORMRepository from "../../MikroORMRepository";
import CalculationTeacherRepository from "./CalculationTeacherRepository";

export default class MikroORMCalculationTeacherRepository
  extends MikroORMRepository<string, CalculationTeacher>
  implements CalculationTeacherRepository
{
  constructor() {
    super({ modelName: "CalculationTeacher" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCalculationsTeacherWithYearGreaterThanActual(_arg0: {
    officialId: number;
    year: number;
  }): Promise<CalculationTeacher[]> {
    throw new Error("Method not implemented.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCalculationsTeacherWithActualYear(_arg0: {
    officialId: number;
    year: number;
  }): Promise<CalculationTeacher[]> {
    throw new Error("Method not implemented.");
  }
}
