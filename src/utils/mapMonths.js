const { Month } = require("@prisma/client");
const Months = new Map();
months();

function months() {
  let i = 0;

  Object.entries(Month).forEach(([key, value]) => {
    i++;
    Months.set(i.toString(), { month: value, number: i });
  });
}

export function getMonthByNumber(number) {
  if (!(typeof number === "number" || typeof number === "string")) {
    throw new Error("The number must be a number or string");
  }

  const month = typeof number === "number" ? "" + number : number;
  return Months.get(month).month;
}

export function getNumberByMonth(month) {
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
