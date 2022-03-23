import CustomError from "./CustomError";

export default class NotExistsError extends CustomError {
  constructor(message, ...args) {
    super(message, ...args);
    this.name = "NotExistsError";
  }
}
