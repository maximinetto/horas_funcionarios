import { DecimalType, EntitySchema } from "@mikro-orm/core";
import ActualBalance from "entities/ActualBalance";
import Entity from "entities/Entity";
import Official, { TypeOfOfficial } from "entities/Official";

export default new EntitySchema<ActualBalance, Entity>({
  name: "ActualBalance",
  abstract: true,
  tableName: "actual_balances",
  extends: "Entity",
  properties: {
    id: {
      type: "uuid",
      primary: true,
    },
    year: {
      type: "int",
    },
    total: {
      type: DecimalType,
    },
    official: {
      reference: "m:1",
      entity: () => Official,
      inversedBy: "actualBalances",
      nullable: true,
    },
    type: {
      enum: true,
      items: () => TypeOfOfficial,
    },
  },
  discriminatorColumn: "type",
});
