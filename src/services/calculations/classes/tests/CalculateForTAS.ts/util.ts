export function hoursToSeconds(hours: number) {
  return BigInt(hours) * 60n * 60n;
}
