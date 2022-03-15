export default class NotExistsError extends Error {
  constructor(message, ...args) {
    super(message, ...args);
    this.name = "NotExistsError";
  }
}
