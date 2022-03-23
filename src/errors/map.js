import InvalidValueError from "./InvalidValueError";
import CustomError from "./CustomError";
import ArrayIsEmptyError from "./ArrayIsEmptyError";

const map = [
  [InvalidValueError.prototype.getClassName(), 500],
  [ArrayIsEmptyError.prototype.getClassName(), 500],
  [CustomError.prototype.getClassName(), 500],
];

export default map;
