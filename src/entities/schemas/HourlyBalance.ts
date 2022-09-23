import { EntitySchema } from "@mikro-orm/core";

import Entity from "../Entity";
import HourlyBalance from "../HourlyBalance";

export default new EntitySchema<HourlyBalance, Entity>({
  name: "HourlyBalance",
  tableName: "hourly_balances",
  extends: "Entity",
  abstract: true,
  properties: {
    id: {
      type: "uuid",
      primary: true,
    },
    year: {
      type: "int",
    },
  },
});
