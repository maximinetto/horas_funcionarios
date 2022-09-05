import { BigIntType, EntitySchema } from "@mikro-orm/core";
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
      type: BigIntType,
      fieldName: "surplus_business",
    },
    surplusNonWorking: {
      type: BigIntType,
      fieldName: "surplus_non_working",
    },
    surplusSimple: {
      type: BigIntType,
      fieldName: "surplus_simple",
    },
    discount: {
      type: BigIntType,
      fieldName: "discount",
    },
    workingOvertime: {
      type: BigIntType,
      fieldName: "working_overtime",
    },
    workingNightOvertime: {
      type: BigIntType,
      fieldName: "working_night_overtime",
    },
    nonWorkingOvertime: {
      type: BigIntType,
      fieldName: "non_working_overtime",
    },
    nonWorkingNightOvertime: {
      type: BigIntType,
      fieldName: "non_working_night_overtime",
    },
    compensatedNightOvertime: {
      type: BigIntType,
      fieldName: "compensated_night_overtime",
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTAS,
      inversedBy: "calculations",
    },
  },
});
