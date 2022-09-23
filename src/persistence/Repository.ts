import { Optional } from "typescript-optional";

import Entity from "../entities/Entity";

export default interface Repository<key, E extends Entity> {
  get(id: key): Promise<Optional<E>>;
  getAll(): Promise<E[]>;
  filter(predicate: Object, options?: Object): Promise<E[]>;

  add(entity: E): Promise<E>;
  addRange(entities: E[]): Promise<E[]>;

  set(entity: E): Promise<E>;
  setRange(data: E, keys: key[]): Promise<E[]>;

  remove(entity: E): Promise<E>;
  removeRange(entities: E[]): Promise<E[]>;

  clear(): Promise<void>;
}
