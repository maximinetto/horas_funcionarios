import CustomError from "./CustomError";

export default class InvalidValueError extends CustomError {
  constructor(message, ...args) {
    super(message, ...args);
    this.name = "InvalidValueError";
  }
}
