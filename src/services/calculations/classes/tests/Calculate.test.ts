import faker from "@faker-js/faker";
import { Month } from "@prisma/client";

import Calculations from "@/collections/Calculations";
import ActualBalance from "@/entities/ActualBalance";
import Calculation from "@/entities/Calculation";
import CalculationSorter from "@/sorters/CalculationSorter";

describe("Sorters and getters", () => {
  let calculationsSorter: CalculationSorter;

  beforeAll(() => {
    calculationsSorter = new CalculationSorter();
  });

  test("Test should sort and get correct values", () => {
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

    const { getBiggestCalculation } = new Calculations(...calculations);

    testSortLowestToHighest();

    const biggestCalculation = getBiggestCalculation();

    expect(biggestCalculation).toEqual(expected[expected.length - 1]);

    testSortLowestToHighest();

    function testSortLowestToHighest() {
      const result = calculations
        .slice()
        .sort(calculationsSorter.sortFromLowestToHighestDate);
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
});
