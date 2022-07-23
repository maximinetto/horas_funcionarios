import CustomError from "errors/CustomError";

export default class ValueNotProvidedError extends CustomError {
  constructor(message = "The value is not provided") {
    super(message);
    this.name = "ValueNotProvidedError";
  }
}
