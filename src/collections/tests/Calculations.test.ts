import Decimal from "decimal.js";

import Calculations from "../../collections/Calculations";
import CalculationTAS from "../../entities/CalculationTAS";
import { Month } from "../../enums/common";
import { buildCalculation } from "../../services/calculations/classes/tests/HoursTASCalculator/buildCalculation";
import { hoursToSeconds } from "../../services/calculations/classes/tests/HoursTASCalculator/util";
import CalculationSorter from "../../sorters/CalculationSorter";
import { generateRandomUUIDV4 } from "../../utils/strings";

test("Should replace calculations and pass test", () => {
  const year = 2020;
  const id = generateRandomUUIDV4();
  const sortCalculations = new CalculationSorter();

  const first = buildCalculation({
    year,
    month: Month.JANUARY,
    observations: "",
    surplusBusiness: 0n,
    surplusNonWorking: 0n,
    surplusSimple: 0n,
    discount: 0n,
    workingOvertime: hoursToSeconds(19),
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(2),
    compensatedNightOvertime: 0n,
    actualBalanceId: id,
  });

  const second = buildCalculation({
    year,
    month: Month.MARCH,
    observations: "",
    surplusBusiness: hoursToSeconds(1) + 17n * 60n,
    surplusNonWorking: hoursToSeconds(3) + 29n * 60n,
    surplusSimple: hoursToSeconds(7) + 38n * 60n,
    discount: hoursToSeconds(4) + 22n * 60n,
    workingOvertime: hoursToSeconds(13),
    workingNightOvertime: 0n,
    nonWorkingOvertime: 0n,
    nonWorkingNightOvertime: hoursToSeconds(3),
    actualBalanceId: id,
    compensatedNightOvertime: 0n,
  });

  const origin: CalculationTAS[] = [
    first,
    buildCalculation({
      year,
      month: Month.FEBRUARY,
      observations: "",
      surplusBusiness: hoursToSeconds(4) + 47n * 60n,
      surplusNonWorking: hoursToSeconds(2) + 33n * 60n,
      surplusSimple: hoursToSeconds(1) + 23n * 60n,
      discount: hoursToSeconds(2) + 33n * 60n,
      workingOvertime: hoursToSeconds(5),
      workingNightOvertime: 0n,
      nonWorkingOvertime: 0n,
      nonWorkingNightOvertime: hoursToSeconds(1),
      actualBalanceId: id,
      compensatedNightOvertime: 0n,
    }),
    second,
    buildCalculation({
      year,
      month: Month.APRIL,
      observations: "Pepe",
      surplusBusiness: hoursToSeconds(12) + 13n * 60n,
      surplusNonWorking: 0n,
      surplusSimple: 0n,
      discount: 0n,
      workingOvertime: hoursToSeconds(1) + 17n * 60n,
      workingNightOvertime: 0n,
      nonWorkingOvertime: 0n,
      nonWorkingNightOvertime: hoursToSeconds(1),
      actualBalanceId: id,
      compensatedNightOvertime: 0n,
    }),
  ];

  const firstExpected = first.copy({
    observations: "Jajajaja",
    discount: new Decimal((hoursToSeconds(1) + 11n * 60n).toString()),
  });

  const secondExpected = second.copy({
    observations: "Jajajaja",
    discount: new Decimal(0),
  });
  const replace: CalculationTAS[] = [
    firstExpected,
    secondExpected,
    buildCalculation({
      year,
      month: Month.MAY,
      observations: "",
      surplusBusiness: hoursToSeconds(0) + 13n * 60n,
      surplusNonWorking: 0n,
      surplusSimple: 0n,
      discount: 0n,
      workingOvertime: 0n,
      workingNightOvertime: 0n,
      nonWorkingOvertime: 0n,
      nonWorkingNightOvertime: 0n,
      actualBalanceId: id,
      compensatedNightOvertime: 0n,
    }),
  ];

  const result = new Calculations(...replace);
  result.mergeCalculations({
    origin,
    replacer,
  });

  const actual = result.toPrimitiveArray();

  const expected = [...replace, origin[1], origin[3]].sort(
    sortCalculations.sortFromLowestToHighestDate
  );

  expect(actual).toHaveLength(expected.length);

  for (let i = 0; i < expected.length; i++) {
    expect(expected[i]).toEqual(actual[i]);
  }
});

function replacer(calculation: CalculationTAS, id: string): CalculationTAS {
  return new CalculationTAS({
    id,
    month: calculation.month,
    year: calculation.year,
    surplusBusiness: calculation.surplusBusiness,
    surplusNonWorking: calculation.surplusNonWorking,
    surplusSimple: calculation.surplusSimple,
    discount: calculation.discount,
    compensatedNightOvertime: calculation.compensatedNightOvertime,
    workingNightOvertime: calculation.workingNightOvertime,
    nonWorkingNightOvertime: calculation.nonWorkingNightOvertime,
    nonWorkingOvertime: calculation.nonWorkingOvertime,
    workingOvertime: calculation.workingOvertime,
    observations: calculation.observations,
    actualBalance: calculation.actualBalance,
  });
}
