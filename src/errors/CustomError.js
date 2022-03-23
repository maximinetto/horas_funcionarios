export default class CustomError extends Error {
  constructor(message, ...args) {
    super(message, ...args);
  }

  getClassName() {
    return this.constructor.name;
  }
}
