import { EntitySchema } from "@mikro-orm/core";

import { Contract, TypeOfOfficial } from "../../enums/officials";
import LuxonDateType from "../../persistence/types/LuxonDateType";
import ActualBalance from "../ActualBalance";
import Entity from "../Entity";
import Official from "../Official";

export default new EntitySchema<Official, Entity>({
  tableName: "officials",
  extends: "Entity",
  class: Official,
  properties: {
    id: {
      type: "number",
      primary: true,
      autoincrement: true,
    },
    recordNumber: {
      type: "number",
      fieldName: "record_number",
    },
    firstName: {
      type: "string",
      fieldName: "first_name",
    },
    lastName: {
      type: "string",
      fieldName: "last_name",
    },
    position: {
      type: "string",
    },
    contract: {
      enum: true,
      items: () => Contract,
    },
    type: {
      enum: true,
      items: () => TypeOfOfficial,
    },
    dateOfEntry: {
      type: LuxonDateType,
    },
    chargeNumber: {
      type: "number",
      fieldName: "charge_number",
    },
    actualBalances: {
      reference: "1:m",
      entity: () => ActualBalance,
      mappedBy: (actualBalance) => actualBalance.official,
    },
  },
});
