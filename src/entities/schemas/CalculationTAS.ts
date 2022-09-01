import { DecimalType, EntitySchema } from "@mikro-orm/core";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";

export default new EntitySchema<CalculationTAS, Calculation>({
  name: "CalculationTAS",
  tableName: "calculation_tas",
  extends: "Calculation",
  class: CalculationTAS,
  properties: {
    surplusBusiness: {
      type: DecimalType,
      fieldName: "surplus_business",
    },
    surplusNonWorking: {
      type: DecimalType,
      fieldName: "surplus_non_working",
    },
    surplusSimple: {
      type: DecimalType,
      fieldName: "surplus_simple",
    },
    discount: {
      type: DecimalType,
      fieldName: "discount",
    },
    workingOvertime: {
      type: DecimalType,
      fieldName: "working_overtime",
    },
    workingNightOvertime: {
      type: DecimalType,
      fieldName: "working_night_overtime",
    },
    nonWorkingOvertime: {
      type: DecimalType,
      fieldName: "non_working_overtime",
    },
    nonWorkingNightOvertime: {
      type: DecimalType,
      fieldName: "non_working_night_overtime",
    },
    compensatedNightOvertime: {
      type: DecimalType,
      fieldName: "compensated_night_overtime",
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTAS,
      inversedBy: "calculations",
    },
  },
});
