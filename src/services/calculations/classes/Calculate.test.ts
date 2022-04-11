import faker from "@faker-js/faker";
import { Month } from "@prisma/client";
import CalculateForTas from "./CalculateForTAS";

test("Test sort", () => {
  const december = {
    id: faker.datatype.uuid(),
    year: 2020,
    month: Month.DECEMBER,
    observations: "asdasd",
    actualBalanceId: faker.datatype.uuid(),
  };

  const january = {
    id: faker.datatype.uuid(),
    year: 2020,
    month: Month.JANUARY,
    observations: "asdasd  sdasdsadasd dasd",
    actualBalanceId: faker.datatype.uuid(),
  };

  const may = {
    id: faker.datatype.uuid(),
    year: 2020,
    month: Month.MAY,
    observations: "",
    actualBalanceId: faker.datatype.uuid(),
  };

  const march = {
    id: faker.datatype.uuid(),
    year: 2020,
    month: Month.MARCH,
    observations: "",
    actualBalanceId: faker.datatype.uuid(),
  };

  const calculations = [december, january, may, march];

  const expected = [january, march, may, december];

  const { sortLowestToHighest, getBiggestCalculation } = new CalculateForTas(
    {}
  );

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
