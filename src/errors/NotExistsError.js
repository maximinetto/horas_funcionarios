export default class NotExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotExistsError";
  }
}
