import { DecimalType, EntitySchema } from "@mikro-orm/core";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";

export default new EntitySchema<HourlyBalanceTAS, HourlyBalance>({
  name: "HourlyBalanceTAS",
  tableName: "hourly_balances_tas",
  extends: "HourlyBalance",
  properties: {
    nonWorking: {
      type: DecimalType,
      fieldName: "surplus_non_working",
      getter: true,
      setter: true,
    },
    simple: {
      type: DecimalType,
      fieldName: "surplus_simple",
      getter: true,
      setter: true,
    },
    working: {
      type: DecimalType,
      fieldName: "surplus_business",
      getter: true,
      setter: true,
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTAS,
      inversedBy: "hourlyBalances",
      getter: true,
      setter: true,
    },
  },
});
