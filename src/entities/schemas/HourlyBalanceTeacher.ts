import { EntitySchema } from "@mikro-orm/core";

import BigNumberType from "../../persistence/types/BigNumberType";
import ActualBalanceTeacher from "../ActualBalanceTeacher";
import HourlyBalance from "../HourlyBalance";
import HourlyBalanceTeacher from "../HourlyBalanceTeacher";

export default new EntitySchema<HourlyBalanceTeacher, HourlyBalance>({
  name: "HourlyBalanceTeacher",
  tableName: "hourly_balance_teachers",
  extends: "HourlyBalance",
  class: HourlyBalanceTeacher,
  properties: {
    balance: {
      type: BigNumberType,
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTeacher,
      inversedBy: "hourlyBalances",
    },
  },
});
