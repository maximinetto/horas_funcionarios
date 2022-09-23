import { EntitySchema } from "@mikro-orm/core";

import ActualBalance from "../ActualBalance";
import ActualBalanceTeacher from "../ActualBalanceTeacher";
import CalculationTeacher from "../CalculationTeacher";
import HourlyBalanceTeacher from "../HourlyBalanceTeacher";

export default new EntitySchema<ActualBalanceTeacher, ActualBalance>({
  name: "ActualBalanceTeacher",
  tableName: "actual_balances",
  extends: "ActualBalance",
  class: ActualBalanceTeacher,
  properties: {
    calculations: {
      reference: "1:m",
      entity: () => CalculationTeacher,
      mappedBy: (calculations) => calculations.actualBalance,
    },
    hourlyBalances: {
      reference: "1:m",
      entity: () => HourlyBalanceTeacher,
      mappedBy: "actualBalance",
    },
  },
  discriminatorValue: "teacher",
});
