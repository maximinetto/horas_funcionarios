import CustomError from "./CustomError";

export default class ArrayIsEmptyError extends CustomError {
  constructor(message = "Array is empty") {
    super(message);
    this.name = "ArrayIsEmptyError";
  }
}
