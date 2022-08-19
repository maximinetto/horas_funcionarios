import { DecimalType, EntitySchema } from "@mikro-orm/core";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import Calculation from "entities/Calculation";
import CalculationTeacher from "entities/CalculationTeacher";

export default new EntitySchema<CalculationTeacher, Calculation>({
  name: "CalculationTeacher",
  tableName: "calculation_teachers",
  extends: "Calculation",
  properties: {
    surplus: {
      type: DecimalType,
      getter: true,
      setter: true,
    },
    discount: {
      type: DecimalType,
      fieldName: "discount",
      getter: true,
      setter: true,
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTeacher,
      inversedBy: "calculations",
      getter: true,
      setter: true,
    },
  },
  discriminatorValue: "teacher",
});
