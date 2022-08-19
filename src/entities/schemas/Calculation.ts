import { EntitySchema } from "@mikro-orm/core";
import Calculation from "entities/Calculation";
import Entity from "entities/Entity";

export default new EntitySchema<Calculation, Entity>({
  name: "Calculation",
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
    month: {
      type: "int",
      getter: true,
      setter: true,
    },
    observations: {
      type: "text",
      nullable: true,
      getter: true,
      setter: true,
    },
  },
});
