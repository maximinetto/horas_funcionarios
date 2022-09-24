import CustomError from "./CustomError";

export default class NotExistsError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "NotExistsError";
  }
}
