import { FilterQuery, MikroORM, wrap } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";
import Entity from "entities/Entity";
import { mikroorm } from "persistence/context/mikroorm/MikroORMDatabase";
import Repository from "persistence/Repository";
import { Optional } from "typescript-optional";

export default class MikroORMRepository<key, T extends Entity>
  implements Repository<key, T>
{
  protected readonly _mikroorm: MikroORM<MariaDbDriver>;
  protected readonly _modelName: string;
  protected readonly _idKey: string;

  constructor({ modelName, idKey }: { modelName: string; idKey?: string }) {
    this._mikroorm = mikroorm;
    this._modelName = modelName;
    this._idKey = idKey ?? "id";
  }

  get(id: key): Promise<Optional<T>> {
    const options = {
      [this._idKey]: id,
    } as FilterQuery<T>;

    return this._mikroorm.em
      .findOne<T>(this._modelName, options)
      .then((entity) => {
        return Optional.ofNullable(entity);
      });
  }

  getAll(): Promise<T[]> {
    const options = {} as FilterQuery<T>;

    return this._mikroorm.em.find<T>(this._modelName, options);
  }

  filter(predicate: Object): Promise<T[]> {
    const options = {
      ...predicate,
    } as FilterQuery<T>;
    return this._mikroorm.em.find<T>(this._modelName, options);
  }

  async add(entity: T): Promise<T> {
    await this._mikroorm.em.persistAndFlush(entity);
    return entity;
  }

  async addRange(entities: T[]): Promise<T[]> {
    await this._mikroorm.em.persistAndFlush(entities);
    return entities;
  }

  set(entity: T): Promise<T> {
    return this.add(entity);
  }

  async setRange(data: any, _keys: key[]): Promise<T[]> {
    const options = {
      [this._idKey]: {
        $in: _keys,
      },
    } as FilterQuery<T>;

    const entities: T[] = await this._mikroorm.em.find(
      this._modelName,
      options
    );

    const entitiesMapped = entities.map((e) => wrap(e).assign(data));

    return this.addRange(entitiesMapped);
  }

  async remove(entity: T): Promise<T> {
    this._mikroorm.em.remove(entity);
    return entity;
  }

  async removeRange(entities: T[]): Promise<T[]> {
    this._mikroorm.em.remove(entities);
    return entities;
  }

  clear(): Promise<void> {
    return Promise.resolve().then(() => {
      this._mikroorm.em.remove(this._modelName);
    });
  }
}
