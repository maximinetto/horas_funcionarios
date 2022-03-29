export const timeToSeconds = (input = "00:00") => {
  if (typeof input !== "string") {
    return 0n;
  }

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

export const secondsToTime = (seconds = 0n) => {
  if (typeof seconds !== "bigint") {
    throw new Error("secondsToTime: seconds must be a bigint");
  }

  let hours = Math.floor(seconds / 3600n);
  let minutes = Math.floor((seconds - hours * 3600n) / 60n);
  const secondsLeft = seconds - hours * 3600n - minutes * 60n;

  if (secondsLeft >= 30n) {
    minutes = minutes === 59n ? 0n : minutes + 1n;
    hours = minutes === 0n ? hours + 1n : hours;
  }

  return `${hours}:${minutes}`;
};
