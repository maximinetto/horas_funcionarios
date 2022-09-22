import { EntitySchema } from "@mikro-orm/core";
import ActualBalance from "entities/ActualBalance";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import CalculationTAS from "entities/CalculationTAS";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";

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
