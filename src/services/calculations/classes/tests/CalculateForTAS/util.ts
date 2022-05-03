import crypto from "crypto";

export function hoursToSeconds(hours: number) {
  return BigInt(hours) * 60n * 60n;
}

export const arrayWithoutElementAtIndex = function <T>(
  arr: Array<T>,
  indexs: number[]
) {
  return arr.filter(function (value, arrIndex) {
    return indexs.includes(arrIndex) === false;
  });
};

export const generateRandomUUIDV4 = function (): string {
  return crypto.randomUUID();
};

export const logger = function (...args: any[]) {
  console.log(args.map((arg) => JSON.stringify(arg, null, 2)).join(" "));
};
