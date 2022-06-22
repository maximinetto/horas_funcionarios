import prisma from "@/persistence/persistence.config";
import { prismaMock } from "@/singleton";
import { getMonthByNumber, getNumberByMonth } from "@/utils/mapMonths";
import { Month } from "@prisma/client";

test("Test get month number by month name.", () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const expected = months.map((month, index) => index + 1);

  const result = months.map((month) =>
    getNumberByMonth(month.toUpperCase() as Month)
  );

  expect(result).toEqual(expected);
});

test("Test get month name by month number", () => {
  const monthsUpperCaseExpected = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const monthsNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const result = monthsNumber.map((month) => getMonthByNumber(month));

  expect(result).toEqual(monthsUpperCaseExpected);
});

afterEach(() => {
  prismaMock.$disconnect();
  prisma.$disconnect();
});
