import CustomError from "./CustomError";

export default class InvalidValueError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "InvalidValueError";
  }
}
