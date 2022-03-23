import CustomError from "./CustomError";

export default class ArrayIsEmptyError extends CustomError {
  constructor(message, ...args) {
    super(message, ...args);
    this.name = "ArrayIsEmptyError";
  }
}
