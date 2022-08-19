import { EntitySchema } from "@mikro-orm/core";
import Entity from "entities/Entity";
import HourlyBalance from "entities/HourlyBalance";

export default new EntitySchema<HourlyBalance, Entity>({
  name: "HourlyBalance",
  tableName: "hourly_balances",
  extends: "Entity",
  abstract: true,
  properties: {
    id: {
      type: "uuid",
      primary: true,
      getter: true,
      setter: true,
    },
    year: {
      type: "int",
      getter: true,
      setter: true,
    },
  },
});