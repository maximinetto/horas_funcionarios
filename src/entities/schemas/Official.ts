import { EntitySchema } from "@mikro-orm/core";
import ActualBalance from "entities/ActualBalance";
import Entity from "entities/Entity";
import Official from "entities/Official";
import { Contract, TypeOfOfficial } from "enums/officials";
import LuxonDateType from "persistence/types/LuxonDateType";

export default new EntitySchema<Official, Entity>({
  name: "Official",
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

      nullable: true,
    },
  },
});
