import { logger as customLogger } from "config";

export function hoursToSeconds(hours: number) {
  return BigInt(hours) * 60n * 60n;
}

export const arrayWithoutElementAtIndex = function <T>(
  arr: Array<T>,
  indexs: number[]
) {
  return arr.filter(function (_value, arrIndex) {
    return indexs.includes(arrIndex) === false;
  });
};

export const logger = function (...args: any[]) {
  const strings = args.map((arg) => JSON.stringify(arg, null, 2)).join(" ");
  customLogger.info(strings);
};

export const logLine = () =>
  customLogger.info("-".repeat(process.stdout.columns));
