import ArrayIsEmptyError from "@/errors/ArrayIsEmptyError";
import CustomError from "@/errors/CustomError";
import InvalidValueError from "@/errors/InvalidValueError";

const map = [
  [InvalidValueError.prototype.getClassName(), 500],
  [ArrayIsEmptyError.prototype.getClassName(), 500],
  [CustomError.prototype.getClassName(), 500],
];

export default map;
