import { EntitySchema } from "@mikro-orm/core";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";
import BigNumberType from "persistence/types/BigNumberType";

export default new EntitySchema<CalculationTAS, Calculation>({
  name: "CalculationTAS",
  tableName: "calculation_tas",
  extends: "Calculation",
  class: CalculationTAS,
  properties: {
    surplusBusiness: {
      type: BigNumberType,
      fieldName: "surplus_business",
    },
    surplusNonWorking: {
      type: BigNumberType,
      fieldName: "surplus_non_working",
    },
    surplusSimple: {
      type: BigNumberType,
      fieldName: "surplus_simple",
    },
    discount: {
      type: BigNumberType,
      fieldName: "discount",
    },
    workingOvertime: {
      type: BigNumberType,
      fieldName: "working_overtime",
    },
    workingNightOvertime: {
      type: BigNumberType,
      fieldName: "working_night_overtime",
    },
    nonWorkingOvertime: {
      type: BigNumberType,
      fieldName: "non_working_overtime",
    },
    nonWorkingNightOvertime: {
      type: BigNumberType,
      fieldName: "non_working_night_overtime",
    },
    compensatedNightOvertime: {
      type: BigNumberType,
      fieldName: "compensated_night_overtime",
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTAS,
      inversedBy: "calculations",
    },
  },
});
