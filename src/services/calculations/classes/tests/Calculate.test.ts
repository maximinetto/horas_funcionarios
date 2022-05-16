import ActualBalance from "@/entities/ActualBalance";
import Calculation from "@/entities/Calculation";
import { CalculationRepository } from "@/persistence/calculations";
import HoursTASCalculator from "@/services/calculations/classes/TAS/HoursTASCalculator";
import faker from "@faker-js/faker";
import { Month } from "@prisma/client";

jest.mock("@/persistence/calculations");

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

  const calculations = enrich([december, january, may, march]);

  const expected = enrich([january, march, may, december]);

  const calculationRepository = new CalculationRepository();

  const { sortLowestToHighest, getBiggestCalculation } = new HoursTASCalculator(
    calculationRepository
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

function enrich(
  calculations: {
    id: string;
    year: number;
    month: Month;
    observations: string;
    actualBalanceId: string;
  }[]
) {
  return calculations.map(
    (c) =>
      new Calculation(
        c.id,
        c.year,
        c.month,
        c.observations,
        new ActualBalance(c.actualBalanceId, c.year)
      )
  );
}
