import { EntitySchema } from "@mikro-orm/core";

import BigNumberType from "../../persistence/types/BigNumberType";
import ActualBalanceTeacher from "../ActualBalanceTeacher";
import Calculation from "../Calculation";
import CalculationTeacher from "../CalculationTeacher";

export default new EntitySchema<CalculationTeacher, Calculation>({
  name: "CalculationTeacher",
  tableName: "calculation_teachers",
  extends: "Calculation",
  class: CalculationTeacher,
  properties: {
    surplus: {
      type: BigNumberType,
    },
    discount: {
      type: BigNumberType,
      fieldName: "discount",
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTeacher,
      inversedBy: "calculations",
    },
  },
});
