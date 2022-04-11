import { DateTime } from "luxon";

export function resetDateFromFirstDay({
  month,
  year,
  day,
}: {
  month: number;
  year: number;
  day?: number;
}) {
  return {
    year: year,
    month: month,
    day: day ? day : 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };
}

export function toDate(year: number, month: number, day: number) {
  return DateTime.fromObject(
    resetDateFromFirstDay({ year, month, day })
  ).toJSDate();
}

export function lastDateOfTheYear(year?: number) {
  if (!year) return;

  return DateTime.fromObject({
    year: year,
    month: 12,
    day: 31,
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 0,
  }).toJSDate();
}
