const { Month } = require("@prisma/client");
const Months = new Map(12);
months();

function months() {
  let i = 0;

  Object.entries(Month).forEach(([key, value]) => {
    i++;
    Months.set(i.toString(), { month: value, number: i });
  });
}

export function getMonthByNumber(number) {
  if (!(typeof number === "number" && typeof number === "string")) {
    throw new Error("The number must be a number or string");
  }

  const month = typeof number === "number" ? "" + number : number;
  return Months.get(month).month;
}

export function getNumberByMonth(month) {
  if (!typeof month === "string") {
    throw new Error("The month must be a string");
  }

  const currentMonth = Months.values().find((m) => m.month === month);
  return currentMonth.number;
}
