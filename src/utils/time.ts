import { Decimal } from "decimal.js";

export const timeToSeconds = (input: string = "00:00") => {
  if (!input.includes(":")) {
    throw new Error("Invalid time format");
  }

  const split = input.split(":");

  if (split.length !== 2) {
    throw new Error("Invalid time format");
  }

  const hours = BigInt(split[0]);
  const minutes = BigInt(split[1]);
  return hours * 60n * 60n + minutes * 60n;
};

export const secondsToTime = (seconds: bigint = 0n) => {
  if (typeof seconds !== "bigint") {
    throw new Error("secondsToTime: seconds must be a bigint");
  }

  const secondsDecimal = new Decimal(seconds.toString());

  let hours = secondsDecimal
    .div(60 * 60)
    .truncated()
    .toString();

  let minutes = secondsDecimal
    .sub(new Decimal(hours).mul(60 * 60))
    .div(60)
    .truncated()
    .toString();

  const secondsLeft = secondsDecimal
    .sub(new Decimal(hours).mul(60 * 60))
    .sub(new Decimal(minutes).mul(60));

  if (secondsLeft.gte(30)) {
    minutes = new Decimal(minutes).eq(59)
      ? "0"
      : new Decimal(minutes).add(1).toString();
    hours = minutes === "0" ? new Decimal(hours).add(1).toString() : hours;
  }

  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};
