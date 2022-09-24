import {
  EntityClass,
  FilterQuery,
  FindOptions,
  MikroORM,
  wrap,
} from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { Optional } from "typescript-optional";

import Entity from "../entities/Entity";
import removeKeyIfValueDoesNotDefined from "../utils/removeKeyIfValueDoesNotDefined";
import { mikroorm } from "./context/mikroorm/MikroORMDatabase";
import Repository from "./Repository";

export default class MikroORMRepository<key, T extends Entity>
  implements Repository<key, T>
{
  protected readonly _mikroorm: MikroORM<MySqlDriver>;
  protected readonly _modelName: EntityClass<T>;
  protected readonly _idKey: string;

  constructor({
    modelName,
    idKey,
  }: {
    modelName: EntityClass<T>;
    idKey?: string;
  }) {
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

  filter(predicate: Object, options?: Object): Promise<T[]> {
    const _predicate = removeKeyIfValueDoesNotDefined(predicate);

    const where = {
      ..._predicate,
    } as FilterQuery<T>;

    const _options = {
      ...options,
    } as FindOptions<T>;

    return this._mikroorm.em.find<T>(this._modelName, where, _options);
  }

  async add(entity: T): Promise<T> {
    this._mikroorm.em.persist(entity);
    return entity;
  }

  async addRange(entities: T[]): Promise<T[]> {
    if (entities.length === 0) return [];
    this._mikroorm.em.persist(entities);
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
    if (entities.length === 0) return [];
    this._mikroorm.em.remove(entities);
    return entities;
  }

  async clear(): Promise<void> {
    await this._mikroorm.em.flush();
    this._mikroorm.em.clear();
    const options = {} as FilterQuery<T>;
    return this._mikroorm.em
      .nativeDelete(this._modelName, options)
      .then(() => Promise.resolve());
  }
}
