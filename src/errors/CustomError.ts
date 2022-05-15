export default class CustomError extends Error {
  constructor(message: string) {
    super(message);
  }

  getClassName() {
    return this.constructor.name;
  }
}
