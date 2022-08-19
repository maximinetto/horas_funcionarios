import { EntitySchema } from "@mikro-orm/core";
import Entity from "entities/Entity";

export default new EntitySchema<Entity>({
  name: "Entity",
  abstract: true,
  properties: {
    createdAt: {
      type: "Date",
      onCreate: () => new Date(),
      nullable: true,
      getter: true,
      setter: true,
    },
    updatedAt: {
      type: "Date",
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
      nullable: true,
      getter: true,
      setter: true,
    },
  },
});
