import UnexpectedError from "./UnexpectedError";

export default class UnexpectedValueError extends UnexpectedError {
  constructor(message: string) {
    super(message);
  }

  getClassName() {
    return this.constructor.name;
  }
}
