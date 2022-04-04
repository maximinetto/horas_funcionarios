const { Month } = require("@prisma/client");
const { default: Calculate } = require("./Calculate");

test("Test sort", () => {
  const calculations = [
    {
      year: 2020,
      month: Month.DECEMBER,
    },
    {
      year: 2020,
      month: Month.JANUARY,
    },
    {
      year: 2020,
      month: Month.MAY,
    },
    {
      year: 2020,
      month: Month.MARCH,
    },
  ];

  const expected = [
    {
      year: 2020,
      month: Month.JANUARY,
    },
    {
      year: 2020,
      month: Month.MARCH,
    },
    {
      year: 2020,
      month: Month.MAY,
    },
    {
      year: 2020,
      month: Month.DECEMBER,
    },
  ];

  const { sortLowestToHighest, getBiggestCalculation } = new Calculate();

  testSortLowestToHighest();

  const biggestCalculation = getBiggestCalculation(calculations);

  expect(biggestCalculation).toEqual(expected[expected.length - 1]);

  testSortLowestToHighest();

  function testSortLowestToHighest() {
    const result = calculations.sort(sortLowestToHighest);
    result.forEach((calculation, index) => {
      const current = expected[index];
      expect(calculation.month).toBe(current.month);
      expect(calculation.year).toBe(current.year);
    });
  }
});
