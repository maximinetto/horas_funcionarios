import { EntitySchema } from "@mikro-orm/core";

export default abstract class Entity {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

export const schema = new EntitySchema<Entity>({
  name: "Entity",
  abstract: true,
  properties: {
    createdAt: { type: "Date", onCreate: () => new Date(), nullable: true },
    updatedAt: {
      type: "Date",
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
      nullable: true,
    },
  },
});
