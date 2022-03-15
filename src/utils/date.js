export function resetDateFromFirstDay({ month, year }) {
  return {
    year: year,
    month: month,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };
}
