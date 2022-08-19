import Calculations from "collections/Calculations";
import MikroORMActualBalanceBuilder from "creators/actual/MikroORMActualBalanceBuilder";
import Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import CalculationTAS from "entities/CalculationTAS";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import { generateRandomUUIDV4 } from "utils/strings";

import subtractHoursFromBalance from "./calculateBalance";
import { calculate } from "./calculateForMonth";
import { CalculationDataTAS } from "./HoursTASCalculator.test";

export default function calculation({
  balances,
  calculations,
}: {
  balances: HourlyBalanceTAS[];
  calculations: Calculations<CalculationTAS>;
}): CalculationDataTAS {
  if (balances.length === 0 && calculations.isEmpty()) {
    return {
      result: [],
      resultSanitized: [],
      balances: [],
      balancesSanitized: [],
      actualBalance: new MikroORMActualBalanceBuilder().create({
        id: generateRandomUUIDV4(),
        year: 0,
        total: new Decimal(0),
        type: "tas",
      }),
    };
  }

  const calculationsCalculated = calculate(calculations);

  const calculationTAS =
    calculations.getSmallestCalculation() as CalculationTAS;
  const actualBalanceAux = calculationTAS.actualBalance;

  const year = calculations.getSmallestCalculation().year;
  const balanceId = generateRandomUUIDV4();

  const newBalances: HourlyBalanceTAS[] = balances.map((b) => {
    const id = generateRandomUUIDV4();
    return new HourlyBalanceTAS({
      id,
      year: b.year,
      working: b.working,
      nonWorking: b.nonWorking,
      simple: b.simple,
      actualBalance: actualBalanceAux,
    });
  });

  const balancesWithCurrentYear: HourlyBalanceTAS[] = [
    ...newBalances,
    new HourlyBalanceTAS({
      id: balanceId,
      year,
      working: calculationsCalculated.working,
      nonWorking: calculationsCalculated.nonWorking,
      simple: calculationsCalculated.simple,

      actualBalance: actualBalanceAux,
    }),
  ];

  const results = subtractHoursFromBalance(
    balancesWithCurrentYear,
    calculationsCalculated.discount
  );

  const total = results.balances.reduce(
    (_total, { simple, working, nonWorking }) =>
      _total.plus(simple).plus(working).plus(nonWorking),
    new Decimal(0)
  );

  const actualBalance: ActualBalance = new ActualBalanceTAS({
    id: actualBalanceAux ? actualBalanceAux.id : generateRandomUUIDV4(),
    year,
    total,
    hourlyBalances: results.balances,
  });

  return {
    actualBalance,
    balances: results.balances,
    balancesSanitized: results.balancesSanitized,
    result: results.result,
    resultSanitized: results.resultSanitized,
  };
}
