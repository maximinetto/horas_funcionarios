export default class InvalidValueError extends Error {
  constructor(message, ...args) {
    super(message, ...args);
    this.name = "InvalidValueError";
  }
}
