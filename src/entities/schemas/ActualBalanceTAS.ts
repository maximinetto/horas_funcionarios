import { EntitySchema } from "@mikro-orm/core";

import ActualBalance from "../ActualBalance";
import ActualBalanceTAS from "../ActualBalanceTAS";
import CalculationTAS from "../CalculationTAS";
import HourlyBalanceTAS from "../HourlyBalanceTAS";

export default new EntitySchema<ActualBalanceTAS, ActualBalance>({
  name: "ActualBalanceTAS",
  tableName: "actual_balances",
  extends: "ActualBalance",
  class: ActualBalanceTAS,
  properties: {
    calculations: {
      reference: "1:m",
      entity: () => CalculationTAS,
      mappedBy: (calculations) => calculations.actualBalance,
      orphanRemoval: true,
    },
    hourlyBalances: {
      reference: "1:m",
      entity: () => HourlyBalanceTAS,
      mappedBy: "actualBalance",
      orphanRemoval: true,
    },
  },
  discriminatorValue: "tas",
});
