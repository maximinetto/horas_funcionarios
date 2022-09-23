import { EntitySchema } from "@mikro-orm/core";

import Entity from "../Entity";

export default new EntitySchema<Entity>({
  name: "Entity",
  abstract: true,
  properties: {
    createdAt: {
      type: "Date",
      onCreate: () => new Date(),
      nullable: true,
    },
    updatedAt: {
      type: "Date",
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
      nullable: true,
    },
  },
});
