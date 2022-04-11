import ArrayIsEmptyError from "@/errors/ArrayIsEmptyError";
import _keyBy from "lodash/keyBy";

export const isFirstValue = (index: number) => index === 0;
export const previousValue = <T>(array: T[], index: number) => {
  if (array == null || !Array.isArray(array)) {
    throw new Error("array must be an array");
  }

  if (index < 0 || index >= array.length) {
    return null;
  }

  return array[index - 1];
};

export const executeIfExistsOrThrow = <T>(
  array: T[],
  callback: (array: T[]) => {}
) => {
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

export const getDiff = <T>(
  from: T[],
  dest: T[],
  predicate: (v1: T, v2: T) => boolean
) => {
  checkConditions(from, dest, predicate);

  return from.filter((v1) => {
    const isPresent = dest.some((v2) => predicate(v1, v2));
    return !isPresent;
  });
};

function checkConditions(
  from: any[],
  dest: any[],
  predicate: (v1, v2) => boolean
) {
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

export const arrayToObject = <T>(array: T[], key: string) => {
  return _keyBy(array, key);
};
