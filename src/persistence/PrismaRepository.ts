import { PrismaClient } from "@prisma/client";
import Entity from "entities/Entity";
import Repository from "persistence/Repository";
import { Optional } from "typescript-optional";

export default abstract class PrismaRepository<key, E extends Entity>
  implements Repository<key, E>
{
  protected readonly _prisma: PrismaClient;
  protected readonly _modelName: string;

  constructor({
    database,
    modelName,
  }: {
    database: PrismaClient;
    modelName: string;
  }) {
    this._prisma = database;
    this._modelName = modelName;

    this.toEntity = this.toEntity.bind(this);
    this.map = this.map.bind(this);
  }

  abstract toEntity(value): E;
  abstract toPersistance(value: E);

  get(id: key): Promise<Optional<E>> {
    return this._prisma[this._modelName]
      .findFirst({
        where: {
          id,
        },
      })
      .then((v) => {
        const model = this.toEntity(v);
        return Optional.ofNullable(model);
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
        data: this.toPersistance(entity),
      })
      .then(this.toEntity);
  }

  addRange(entities: E[]): Promise<E[]> {
    return this._prisma[this._modelName]
      .createMany({
        data: entities.map((v) => this.toPersistance(v)),
      })
      .then(this.map);
  }

  set(entity: E): Promise<E> {
    return this._prisma[this._modelName]
      .update({
        where: {
          id: entity["id"],
        },
        data: this.toPersistance(entity),
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

  private map(values): E[] {
    return values.map((v) => this.toEntity(v));
  }
}
