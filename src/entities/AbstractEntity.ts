import Entity from "./Entity";

export class AbstractEntity implements Entity {
  private _entityName: string;

  constructor() {
    this._entityName = this.constructor.name;
  }

  entityName(): string {
    return this._entityName;
  }
}
