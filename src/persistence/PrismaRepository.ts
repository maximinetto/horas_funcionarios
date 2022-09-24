import { PrismaClient } from "@prisma/client";
import { Optional } from "typescript-optional";

import Entity from "../entities/Entity";
import Repository from "../persistence/Repository";

export default abstract class PrismaRepository<key, E extends Entity>
  implements Repository<key, E>
{
  protected readonly _prisma: PrismaClient;
  protected readonly _modelName: string;

  constructor({
    prisma,
    modelName,
  }: {
    prisma: PrismaClient;
    modelName: string;
  }) {
    this._prisma = prisma;
    this._modelName = modelName;

    this.toEntity = this.toEntity.bind(this);
    this.map = this.map.bind(this);
  }

  abstract toEntity(value): E;
  abstract toModel(value: E);

  get(id: key): Promise<Optional<E>> {
    return this._prisma[this._modelName]
      .findFirst({
        where: {
          id,
        },
      })
      .then((v) => {
        if (v) return Optional.of(this.toEntity(v));

        return Optional.empty();
      });
  }

  getAll(): Promise<E[]> {
    return this._prisma[this._modelName].findMany().then(this.map);
  }

  filter(predicate: Object): Promise<E[]> {
    return this._prisma[this._modelName].findMany(predicate).then(this.map);
  }

  add(entity: E): Promise<E> {
    return this._prisma[this._modelName]
      .create({
        data: this.toModel(entity),
      })
      .then(this.toEntity);
  }

  addRange(entities: E[]): Promise<E[]> {
    return this._prisma[this._modelName]
      .createMany({
        data: entities.map((v) => this.toModel(v)),
      })
      .then(this.map);
  }

  set(entity: E): Promise<E> {
    return this._prisma[this._modelName]
      .update({
        where: {
          id: entity["id"],
        },
        data: this.toModel(entity),
      })
      .then(this.toEntity);
  }

  setRange(data: E, keys: key[]): Promise<E[]> {
    return this._prisma[this._modelName]
      .updateMany({
        where: {
          id: {
            in: keys,
          },
        },
        data: this.toModel(data),
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

  clear(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private map(values): E[] {
    return values.map((v) => this.toEntity(v));
  }
}
