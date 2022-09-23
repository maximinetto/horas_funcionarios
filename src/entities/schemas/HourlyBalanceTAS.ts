import { EntitySchema } from "@mikro-orm/core";

import BigNumberType from "../../persistence/types/BigNumberType";
import ActualBalanceTAS from "../ActualBalanceTAS";
import HourlyBalance from "../HourlyBalance";
import HourlyBalanceTAS from "../HourlyBalanceTAS";

export default new EntitySchema<HourlyBalanceTAS, HourlyBalance>({
  name: "HourlyBalanceTAS",
  tableName: "hourly_balances_tas",
  extends: "HourlyBalance",
  class: HourlyBalanceTAS,
  properties: {
    nonWorking: {
      type: BigNumberType,
      fieldName: "surplus_non_working",
    },
    simple: {
      type: BigNumberType,
      fieldName: "surplus_simple",
    },
    working: {
      type: BigNumberType,
      fieldName: "surplus_business",
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalanceTAS,
      inversedBy: "hourlyBalances",
    },
  },
});
