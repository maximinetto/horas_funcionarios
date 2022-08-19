import { DecimalType, EntitySchema } from "@mikro-orm/core";
import ActualBalance from "entities/ActualBalance";
import Entity from "entities/Entity";
import Official from "entities/Official";

export default new EntitySchema<ActualBalance, Entity>({
  name: "ActualBalance",
  abstract: true,
  tableName: "actual_balances",
  extends: "Entity",
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
    total: {
      type: DecimalType,
      getter: true,
      setter: true,
    },
    official: {
      reference: "m:1",
      entity: () => Official,
      inversedBy: "actualBalances",
      nullable: true,
      getter: true,
      setter: true,
    },
    type: {
      enum: true,
      getter: true,
      setter: true,
    },
  },
  discriminatorColumn: "type",
});
