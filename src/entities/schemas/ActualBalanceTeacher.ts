import { EntitySchema } from "@mikro-orm/core";
import ActualBalance from "entities/ActualBalance";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import CalculationTeacher from "entities/CalculationTeacher";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";

export default new EntitySchema<ActualBalanceTeacher, ActualBalance>({
  name: "ActualBalanceTeacher",
  tableName: "actual_balances",
  extends: "ActualBalance",
  properties: {
    calculations: {
      reference: "1:m",
      entity: () => CalculationTeacher,
      mappedBy: (calculations) => calculations.actualBalance,
      getter: true,
      setter: true,
    },
    hourlyBalances: {
      reference: "1:m",
      entity: () => HourlyBalanceTeacher,
      mappedBy: "actualBalance",
      getter: true,
      setter: true,
    },
  },
  discriminatorValue: "tas",
});
