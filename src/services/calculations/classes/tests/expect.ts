import { CalculationCalculated } from "@/@types/calculations";
import CalculationTAS from "@/entities/CalculationTAS";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";

import calculateForTAS from "../../TAS";
import calculation from "./HoursTASCalculator/calculate";
import { calculateTotalBalance } from "./HoursTASCalculator/calculateBalance";
import { calculate } from "./HoursTASCalculator/calculateForMonth";
import expectBalance from "./HoursTASCalculator/expectBalance";
import { CalculationDataTAS } from "./HoursTASCalculator/HoursTASCalculator.test";
import { Data } from "./HoursTASCalculator/types";

export async function expectCalculationEquals(
  {
    lastBalances,
    data,
  }: {
    lastBalances: HourlyBalanceTAS[];
    data: Data;
  },
  _calculations: CalculationTAS[]
) {
  const response = await calculateForTAS({
    calculations: data.calculations,
    official: data.official,
    year: data.year,
  });

  const currentYear = response.currentYear;

  const balances = expectCurrentActualBalanceEquals(
    lastBalances,
    currentYear,
    _calculations
  );

  return {
    others: response.others,
    balancesCalculated: balances,
    actualBalances: response.actualHourlyBalances,
  };
}

export function expectCurrentActualBalanceEquals(
  lastBalances: HourlyBalanceTAS[],
  currentCalculation: CalculationCalculated,
  _calculations: CalculationTAS[]
): CalculationDataTAS {
  const totalCalculationsCurrentYear = calculate(_calculations);
  const total = calculateTotalBalance(
    totalCalculationsCurrentYear,
    lastBalances
  );
  const totalBalances = calculation({
    balances: lastBalances,
    calculations: _calculations,
  });

  expect(currentCalculation.totalSimpleHours.value.toString()).toBe(
    totalCalculationsCurrentYear.simple.toString()
  );
  expect(
    totalCalculationsCurrentYear.working.equals(
      currentCalculation.totalWorkingHours.value
    )
  ).toBeTruthy();
  expect(
    totalCalculationsCurrentYear.nonWorking.equals(
      currentCalculation.totalNonWorkingHours.value
    )
  ).toBeTruthy();
  expect(currentCalculation.totalBalance.toString()).toBe(
    total.totalHours.toString()
  );

  expectBalance(currentCalculation.balances).toBe(totalBalances.result);

  expectBalance(currentCalculation.balancesSanitized).toBe(
    totalBalances.resultSanitized
  );

  return totalBalances;
}
