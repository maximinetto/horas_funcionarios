import { EntitySchema } from "@mikro-orm/core";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import BigNumberType from "persistence/types/BigNumberType";

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
