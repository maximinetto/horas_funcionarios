import { EntitySchema } from "@mikro-orm/core";
import ActualBalance from "entities/ActualBalance";
import Entity from "entities/Entity";
import Official from "entities/Official";
import LuxonDateTimeType from "persistence/types/LuxonDateTimeType";

export default new EntitySchema<Official, Entity>({
  name: "Official",
  tableName: "officials",
  extends: "Entity",
  properties: {
    id: {
      type: "number",
      primary: true,
      autoincrement: true,
      getter: true,
      setter: true,
    },
    recordNumber: {
      type: "number",
      fieldName: "record_number",
      getter: true,
      setter: true,
    },
    firstName: {
      type: "string",
      fieldName: "first_name",
      getter: true,
      setter: true,
    },
    lastName: {
      type: "string",
      fieldName: "last_name",
      getter: true,
      setter: true,
    },
    position: {
      type: "string",
      getter: true,
      setter: true,
    },
    contract: {
      type: "string",
      getter: true,
      setter: true,
    },
    type: {
      type: "string",
      getter: true,
      setter: true,
    },
    dateOfEntry: {
      type: LuxonDateTimeType,
      getter: true,
      setter: true,
    },
    chargeNumber: {
      type: "number",
      fieldName: "charge_number",
      getter: true,
      setter: true,
    },
    actualBalances: {
      reference: "1:m",
      entity: () => ActualBalance,
      mappedBy: (actualBalance) => actualBalance.official,
      getter: true,
      setter: true,
      nullable: true,
    },
  },
});
