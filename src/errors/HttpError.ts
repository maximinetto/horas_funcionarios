export default class HttpError extends Error {
  private _httpCode: number;

  constructor(message: string, httpCode: number) {
    super(message);
    this._httpCode = httpCode;
  }

  getClassName() {
    return this.constructor.name;
  }

  get httpCode() {
    return this._httpCode;
  }
}
