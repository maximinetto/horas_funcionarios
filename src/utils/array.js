import _keyBy from "lodash/keyBy";
import ArrayIsEmptyError from "errors/ArrayIsEmptyError";

export const isFirstValue = (index) => index === 0;
export const previousValue = (array, index) => {
  if (array == null || !Array.isArray(array)) {
    throw new Error("array must be an array");
  }

  if (index < 0 || index >= array.length) {
    return null;
  }

  return array[index - 1];
};

export const executeIfExistsOrThrow = (array, callback) => {
  if (array == null || !Array.isArray(array)) {
    throw new Error("array must be an array");
  }

  if (callback && typeof callback !== "function") {
    throw new Error("callback must be a function");
  }

  if (!array.length) throw new ArrayIsEmptyError();

  if (callback) return callback(array);

  return Promise.resolve(array);
};

export const getDiff = (from, dest, predicate) => {
  checkConditions(from, dest, predicate);

  return from.filter((v1) => {
    const isPresent = dest.some((v2) => predicate(v1, v2));
    return !isPresent;
  });
};

function checkConditions(from, dest, predicate) {
  if (!from || !dest || !predicate) {
    throw new Error("from, dest and predict must be defined");
  }

  if (!Array.isArray(from)) {
    throw new Error("from must be an array");
  }

  if (!Array.isArray(dest)) {
    throw new Error("dest must be an array");
  }

  if (typeof predicate !== "function") {
    throw new Error("predicate must be a function");
  }
}

export const arrayToObject = (array, key) => {
  return _keyBy(array, key);
};
