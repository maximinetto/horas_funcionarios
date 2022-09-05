import { BigIntType, EntitySchema } from "@mikro-orm/core";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";

export default new EntitySchema<HourlyBalanceTAS, HourlyBalance>({
  name: "HourlyBalanceTAS",
  tableName: "hourly_balances_tas",
  extends: "HourlyBalance",
  class: HourlyBalanceTAS,
  properties: {
    nonWorking: {
      type: BigIntType,
      fieldName: "surplus_non_working",
    },
    simple: {
      type: BigIntType,
      fieldName: "surplus_simple",
    },
    working: {
      type: BigIntType,
      fieldName: "surplus_business",
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTAS,
      inversedBy: "hourlyBalances",
    },
  },
});
