import { secondsToTime, timeToSeconds } from "utils/time";

test("Time should be converted into seconds", async () => {
  let seconds = timeToSeconds("01:10");
  expect(seconds).toBe(4200n);
  seconds = timeToSeconds("53:49");
  expect(seconds).toBe(193740n);
  seconds = timeToSeconds("1255:23");
  expect(seconds).toBe(4519380n);
  seconds = timeToSeconds("00:00");
  expect(seconds).toBe(0n);
  seconds = timeToSeconds("00:11");
  expect(seconds).toBe(660n);
});
test("Seconds should be converted into time input", async () => {
  let time = secondsToTime(88200n);
  expect(time).toBe("24:30");
  time = secondsToTime(0n);
  expect(time).toBe("00:00");
  time = secondsToTime(9n);
  expect(time).toBe("00:00");
  time = secondsToTime(BigInt(60 * 9));
  expect(time).toBe("00:09");
});
