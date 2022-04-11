import ArrayIsEmptyError from "./ArrayIsEmptyError";
import CustomError from "./CustomError";
import InvalidValueError from "./InvalidValueError";

const map = [
  [InvalidValueError.prototype.getClassName(), 500],
  [ArrayIsEmptyError.prototype.getClassName(), 500],
  [CustomError.prototype.getClassName(), 500],
];

export default map;
