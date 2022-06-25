import Decimal from "decimal.js";

import Calculations from "@/collections/Calculations";
import ActualBalance from "@/entities/ActualBalance";
import CalculationTAS from "@/entities/CalculationTAS";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
import { generateRandomUUIDV4 } from "@/utils/strings";

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
      actualBalance: new ActualBalance(
        generateRandomUUIDV4(),
        0,
        new Decimal(0),
        undefined,
        []
      ),
    };
  }

  const calculationsCalculated = calculate(calculations);

  const actualBalanceAux = calculations
    .getSmallestCalculation()
    .actualBalance.get();

  const year = calculations.getSmallestCalculation().year;
  const balanceId = generateRandomUUIDV4();

  const newBalances: HourlyBalanceTAS[] = balances.map((b) => {
    const id = generateRandomUUIDV4();
    return new HourlyBalanceTAS(
      id,
      b.year,
      b.working,
      b.nonWorking,
      b.simple,
      generateRandomUUIDV4(),
      actualBalanceAux
    );
  });

  const balancesWithCurrentYear: HourlyBalanceTAS[] = [
    ...newBalances,
    new HourlyBalanceTAS(
      balanceId,
      year,
      calculationsCalculated.working,
      calculationsCalculated.nonWorking,
      calculationsCalculated.simple,
      generateRandomUUIDV4(),
      actualBalanceAux
    ),
  ];

  const results = subtractHoursFromBalance(
    balancesWithCurrentYear,
    calculationsCalculated.discount
  );

  const total = new Decimal(0);
  results.balances.reduce(
    (total, { simple, working, nonWorking }) =>
      total.plus(simple).plus(working).plus(nonWorking),
    new Decimal(0)
  );

  const actualBalance: ActualBalance = new ActualBalance(
    actualBalanceAux.id,
    year,
    total,
    actualBalanceAux.official.orUndefined(),
    results.balances
  );

  return {
    actualBalance,
    balances: results.balances,
    balancesSanitized: results.balancesSanitized,
    result: results.result,
    resultSanitized: results.resultSanitized,
  };
}
