import { Month } from "../enums/common";

type MonthArray = Array<{
  key: string;
  month: Month;
  number: number;
}>;
const Months = new Map<string, { month: Month; number: number }>(
  months().map(({ key, month, number }) => [key, { month, number }])
);

function months(): MonthArray {
  let i = 0;

  return Object.entries(Month).map(([, value]) => {
    i++;
    return { key: i.toString(), month: value, number: i };
  });
}

export function getMonthByNumber(number: number | string) {
  if (!(typeof number === "number" || typeof number === "string")) {
    throw new Error("The number must be a number or string");
  }

  const monthNumber = typeof number === "number" ? "" + number : number;
  const monthName = Months.get(monthNumber);
  if (!monthName) throw new Error("The number must be a valid month number");
  return monthName.month;
}

export function getNumberByMonth(month: Month) {
  if (month == null || !(typeof month === "string")) {
    throw new Error("The month must be a string");
  }

  const months = Array.from(Months);

  const monthName = month.toUpperCase();

  const result = months.find(([, m]) => m.month === monthName);
  if (!result) {
    throw new Error("The month must be a valid month");
  }

  const [, currentMonth] = result;

  return currentMonth.number;
}
