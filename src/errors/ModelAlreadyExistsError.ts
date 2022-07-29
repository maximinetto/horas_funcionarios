export default class ModelAlreadyExistsError extends Error {
  private _description: string;

  constructor(message: string, description) {
    super(message);
    this._description = description;
  }

  get description() {
    return this._description;
  }

  getClassName() {
    return this.constructor.name;
  }
}
