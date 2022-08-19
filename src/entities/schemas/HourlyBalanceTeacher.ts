import { DecimalType, EntitySchema } from "@mikro-orm/core";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";

export default new EntitySchema<HourlyBalanceTeacher, HourlyBalance>({
  name: "HourlyBalanceTeacher",
  tableName: "hourly_balance_teachers",
  extends: "HourlyBalance",
  properties: {
    balance: {
      type: DecimalType,
      fieldName: "surplus_non_working",
      getter: true,
      setter: true,
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTeacher,
      inversedBy: "hourlyBalances",
      getter: true,
      setter: true,
    },
  },
});
