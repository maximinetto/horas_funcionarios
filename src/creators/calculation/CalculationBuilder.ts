import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTeacher from "entities/CalculationTeacher";

import {
  CalculationModel,
  CalculationTASModel,
  CalculationTeacherModel,
} from "./types";

export default interface CalculationBuilder {
  create(calculation: CalculationModel): Calculation;
  createTAS(calculationTAS: CalculationTASModel): CalculationTAS;
  createTeacher(
    calculationTeacher: CalculationTeacherModel
  ): CalculationTeacher;
}
