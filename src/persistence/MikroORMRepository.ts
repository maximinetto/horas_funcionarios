import { FilterQuery, MikroORM, wrap } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import Entity from "entities/Entity";
import Official from "entities/Official";
import _isNil from "lodash/isNil";
import _omitBy from "lodash/omitBy";
import { mikroorm } from "persistence/context/mikroorm/MikroORMDatabase";
import Repository from "persistence/Repository";
import { Optional } from "typescript-optional";

export default class MikroORMRepository<key, T extends Entity>
  implements Repository<key, T>
{
  protected readonly _mikroorm: MikroORM<MySqlDriver>;
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
    const _predicate = _omitBy(predicate, _isNil);

    const options = {
      ..._predicate,
    } as FilterQuery<T>;

    return this._mikroorm.em.find<T>(this._modelName, options);
  }

  async add(entity: T): Promise<T> {
    console.log("persist");
    console.log("actualBalanceTAS?", entity instanceof ActualBalanceTAS);
    console.log(
      "actualBalanceTeacher?",
      entity instanceof ActualBalanceTeacher
    );
    console.log("official?", entity instanceof Official);
    this._mikroorm.em.persist(entity);
    return entity;
  }

  async addRange(entities: T[]): Promise<T[]> {
    this._mikroorm.em.persist(entities);
    return entities;
  }

  set(entity: T): Promise<T> {
    console.log("merge");
    console.log("actualBalanceTAS?", entity instanceof ActualBalanceTAS);
    console.log(
      "actualBalanceTeacher?",
      entity instanceof ActualBalanceTeacher
    );
    console.log("official?", entity instanceof Official);
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

  async clear(): Promise<void> {
    await this._mikroorm.em.flush();
    this._mikroorm.em.clear();
    return this._mikroorm.em
      .nativeDelete(this._modelName, {})
      .then(() => Promise.resolve());
  }
}
