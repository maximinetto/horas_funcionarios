import { EntitySchema } from "@mikro-orm/core";
import Calculation from "entities/Calculation";
import Entity from "entities/Entity";
import MonthType from "persistence/types/MonthType";

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
      type: MonthType,
    },
    observations: {
      type: "text",
      nullable: true,
    },
  },
});
