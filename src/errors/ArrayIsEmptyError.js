export default class ArrayIsEmptyError extends Error {
  constructor(message, ...args) {
    super(message, ...args);
    this.name = "ArrayIsEmptyError";
  }
}
