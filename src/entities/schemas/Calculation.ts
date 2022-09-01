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
    },
    year: {
      type: "int",
    },
    month: {
      type: "int",
    },
    observations: {
      type: "text",
      nullable: true,
    },
  },
});
