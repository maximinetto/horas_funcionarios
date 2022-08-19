import { DecimalType, EntitySchema } from "@mikro-orm/core";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";

export default new EntitySchema<CalculationTAS, Calculation>({
  name: "CalculationTAS",
  tableName: "calculation_tas",
  extends: "Calculation",
  properties: {
    surplusBusiness: {
      type: DecimalType,
      fieldName: "surplus_business",
      getter: true,
      setter: true,
    },
    surplusNonWorking: {
      type: DecimalType,
      fieldName: "surplus_non_working",
      getter: true,
      setter: true,
    },
    surplusSimple: {
      type: DecimalType,
      fieldName: "surplus_simple",
      getter: true,
      setter: true,
    },
    discount: {
      type: DecimalType,
      fieldName: "discount",
      getter: true,
      setter: true,
    },
    workingOvertime: {
      type: DecimalType,
      fieldName: "working_overtime",
      getter: true,
      setter: true,
    },
    workingNightOvertime: {
      type: DecimalType,
      fieldName: "working_night_overtime",
      getter: true,
      setter: true,
    },
    nonWorkingOvertime: {
      type: DecimalType,
      fieldName: "non_working_overtime",
      getter: true,
      setter: true,
    },
    nonWorkingNightOvertime: {
      type: DecimalType,
      fieldName: "non_working_night_overtime",
      getter: true,
      setter: true,
    },
    compensatedNightOvertime: {
      type: DecimalType,
      fieldName: "compensated_night_overtime",
      getter: true,
      setter: true,
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTAS,
      inversedBy: "calculations",
      getter: true,
      setter: true,
    },
  },
});
