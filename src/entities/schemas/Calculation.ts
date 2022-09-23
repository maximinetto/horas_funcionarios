import { EntitySchema } from "@mikro-orm/core";

import MonthType from "../../persistence/types/MonthType";
import Calculation from "../Calculation";
import Entity from "../Entity";

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
