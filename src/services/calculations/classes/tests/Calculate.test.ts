import faker from "@faker-js/faker";
import Decimal from "decimal.js";
import { DateTime } from "luxon";
import { beforeAll, describe, expect, test } from "vitest";

import Calculations from "../../../../collections/Calculations";
import { actualHourlyBalanceBuilder } from "../../../../dependencies/container";
import ActualBalanceTeacher from "../../../../entities/ActualBalanceTeacher";
import CalculationTeacher from "../../../../entities/CalculationTeacher";
import Official from "../../../../entities/Official";
import { Month } from "../../../../enums/common";
import { Contract, TypeOfOfficial } from "../../../../enums/officials";
import { mikroorm } from "../../../../persistence/context/mikroorm/MikroORMDatabase";
import CalculationSorter from "../../../../sorters/CalculationSorter";
import { getNumberByMonth } from "../../../../utils/mapMonths";

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

    const expected = calculations.slice().sort(sort);

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
    return calculations.map((c) => {
      const official = mikroorm.em.create(Official, {
        id: 1,
        chargeNumber: 1,
        contract: Contract.PERMANENT,
        dateOfEntry: DateTime.now(),
        firstName: "Maxi",
        lastName: "Minetto",
        position: "Informatic",
        recordNumber: 1,
        type: TypeOfOfficial.TAS,
      });
      const actualHourlyBalanceTeacher = actualHourlyBalanceBuilder.create({
        id: c.actualBalanceId,
        year: c.year,
        total: new Decimal(0),
        official,
        type: TypeOfOfficial.TEACHER,
      }) as ActualBalanceTeacher;

      return new CalculationTeacher({
        id: c.id,
        year: c.year,
        month: c.month,
        observations: c.observations,
        actualBalance: actualHourlyBalanceTeacher,
        discount: new Decimal(0),
        surplus: new Decimal(0),
      });
    });
  }

  function sort(c1: CalculationTeacher, c2: CalculationTeacher) {
    const month1 = getNumberByMonth(c1.month);
    const month2 = getNumberByMonth(c2.month);

    return month1 - month2;
  }
});
