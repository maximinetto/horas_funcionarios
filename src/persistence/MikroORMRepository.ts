import { MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";
import Entity from "entities/Entity";
import { Optional } from "typescript-optional";

import Repository from "./Repository";

export default class MikroORMRepository<key, E extends Entity>
  implements Repository<key, E>
{
  protected readonly _mikroorm: MikroORM<MariaDbDriver>;
  protected readonly _modelName: string;

  constructor({
    database,
    modelName,
  }: {
    database: MikroORM<MariaDbDriver>;
    modelName: string;
  }) {
    this._mikroorm = database;
    this._modelName = modelName;
    get(id: key): Promise<Optional<E>> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<E[]> {
        throw new Error("Method not implemented.");
    }
    filter(predicate: Object): Promise<E[]> {
        throw new Error("Method not implemented.");
    }
    add(entity: E): Promise<E> {
        throw new Error("Method not implemented.");
    }
    addRange(entities: E[]): Promise<E[]> {
        throw new Error("Method not implemented.");
    }
    set(entity: E): Promise<E> {
        throw new Error("Method not implemented.");
    }
    setRange(data: E, keys: key[]): Promise<E[]> {
        throw new Error("Method not implemented.");
    }
    remove(entity: E): Promise<E> {
        throw new Error("Method not implemented.");
    }
    removeRange(entities: E[]): Promise<E[]> {
        throw new Error("Method not implemented.");
    }
  }
}
