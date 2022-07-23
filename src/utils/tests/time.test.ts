import { secondsToTime, timeToSeconds } from "utils/time";

test("Time should be converted into seconds", async () => {
  const seconds = timeToSeconds("01:10");
  expect(seconds).toBe(4200n);
});
test("Seconds should be converted into time input", async () => {
  const time = secondsToTime(88200n);
  expect(time).toBe("24:30");
});
