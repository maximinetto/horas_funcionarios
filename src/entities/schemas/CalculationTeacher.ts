import { BigIntType, EntitySchema } from "@mikro-orm/core";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import Calculation from "entities/Calculation";
import CalculationTeacher from "entities/CalculationTeacher";

export default new EntitySchema<CalculationTeacher, Calculation>({
  name: "CalculationTeacher",
  tableName: "calculation_teachers",
  extends: "Calculation",
  class: CalculationTeacher,
  properties: {
    surplus: {
      type: BigIntType,
    },
    discount: {
      type: BigIntType,
      fieldName: "discount",
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTeacher,
      inversedBy: "calculations",
    },
  },
});
