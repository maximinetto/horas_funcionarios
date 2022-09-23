import { EntitySchema } from "@mikro-orm/core";

import { TypeOfOfficial } from "../../enums/officials";
import BigNumberType from "../../persistence/types/BigNumberType";
import ActualBalance from "../ActualBalance";
import Entity from "../Entity";
import Official from "../Official";

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
      type: BigNumberType,
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
