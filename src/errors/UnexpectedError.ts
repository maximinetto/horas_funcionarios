export default class UnexpectedError extends Error {
  constructor(message: string) {
    super(message);
  }

  getClassName() {
    return this.constructor.name;
  }
}
