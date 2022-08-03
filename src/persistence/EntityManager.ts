import { PrismaClient } from "@prisma/client";
import Entity from "entities/Entity";
import UnexpectedError from "errors/UnexpectedError";
import { Optional } from "typescript-optional";

import { EntityName, getModel, getModelByRef } from "./map";
import Repository from "./Repository";

export default class EntityManager<key> {
  private _repositories: Map<string, Repository<key, Entity>> = new Map();

  private readonly _prisma: PrismaClient;

  constructor({ database }: { database: PrismaClient; modelName: string }) {
    this._prisma = database;
  }

  findOne(EntityRef: EntityName, id: key): Promise<Entity> {
    const repository = this.searchRepository(EntityRef);

    const modelName = getModelByRef(EntityRef);

    return this._prisma[modelName]
      .findFirst({
        where: {
          id,
        },
      })
      .then((v) => {
        if (v) return Optional.of(repository.toEntity(v));

        return Optional.empty();
      });
  }

  findAll(EntityRef: EntityName): Promise<Entity[]> {
    const repository = this.searchRepository(EntityRef);

    const modelName = getModelByRef(EntityRef);

    return this._prisma[modelName].findMany().then(this.map(repository));
  }

  filter(EntityRef: EntityName, predicate: Object): Promise<Entity[]> {
    const repository = this.searchRepository(EntityRef);

    const modelName = getModelByRef(EntityRef);

    return this._prisma[modelName]
      .findMany(predicate)
      .then(this.map(repository));
  }

  persist(entity: Entity): Promise<Entity> {
    const repository = this.searchRepository(entity.entityName());

    const modelName = getModel(entity);

    return this._prisma[modelName]
      .create({
        data: repository.toModel(entity),
      })
      .then(repository.toEntity);
  }

  persistAll(entities: Entity[]): Promise<Entity[]> {
    if (entities.length === 0) {
      return Promise.resolve([]);
    }

    const entity = entities[0];

    const repository = this.searchRepository(entity.entityName());

    const modelName = getModel(entity);

    return this._prisma[modelName]
      .createMany({
        data: entities.map((v) => repository.toModel(v)),
      })
      .then(this.map);
  }

  save(entity: Entity): Promise<Entity> {
    return this._prisma[this._modelName]
      .update({
        where: {
          id: entity["id"],
        },
        data: this.toPersistance(entity),
      })
      .then(this.toEntity);
  }

  setRange(data: Entity, keys: key[]): Promise<Entity[]> {
    return this._prisma[this._modelName]
      .updateMany({
        where: {
          id: {
            in: keys,
          },
        },
        data: this.toPersistance(data),
      })
      .then(this.map);
  }

  remove(entity: E): Promise<E> {
    return this._prisma[this._modelName]
      .delete({
        where: {
          id: entity["id"],
        },
      })
      .then(this.toEntity);
  }

  removeRange(entities: E[]): Promise<E[]> {
    return this._prisma[this._modelName]
      .deleteMany({
        where: {
          id: {
            in: entities.map((e) => e["id"]),
          },
        },
      })
      .then(this.map);
  }

  private searchRepository(entity: EntityName) {
    const entityName = this.getName(entity);

    const repository = this._repositories.get(entityName);

    if (!repository) {
      throw new UnexpectedError(
        "The Entity provided is not register in the application"
      );
    }

    return repository;
  }

  private map(repository: Repository<key, Entity>): (values: []) => Entity[] {
    return (values: any[]) => values.map((v) => repository.toEntity(v));
  }
}
