import { CalculationCalculated } from "@/@types/calculations";
import CalculationTAS from "@/entities/CalculationTAS";
import calculateForTAS from "../../TAS";
import calculation from "./HoursTASCalculator/calculate";
import { calculateTotalBalance } from "./HoursTASCalculator/calculateBalance";
import { calculate } from "./HoursTASCalculator/calculateForMonth";
import expectBalance from "./HoursTASCalculator/expectBalance";
import { CalculationDataTAS } from "./HoursTASCalculator/HoursTASCalculator.test";
import { actualBalanceRepository } from "./HoursTASCalculator/mock";
import {
  HourlyBalanceTASNotNullable,
  Result,
} from "./HoursTASCalculator/types";

export async function expectCalculationEquals(
  { lastBalances, data }: Result,
  _calculations: CalculationTAS[]
) {
  console.info("_calculations", {
    calculations: _calculations,
  });

  console.info("data.calculations", {
    calculations: data.calculations,
  });

  const response = await calculateForTAS({
    calculations: data.calculations,
    official: data.official,
    year: data.year,
    actualBalanceRepository: actualBalanceRepository,
  });

  const currentYear = response.currentYear;

  const balances = expectCurrentActualBalanceEquals(
    lastBalances,
    currentYear,
    _calculations,
    data.official.id
  );

  return {
    others: response.others,
    balancesCalculated: balances,
    actualBalances: response.actualHourlyBalances,
  };
}

export function expectCurrentActualBalanceEquals(
  lastBalances: HourlyBalanceTASNotNullable[],
  currentCalculation: CalculationCalculated,
  _calculations: CalculationTAS[],
  officialId: number = 1
): CalculationDataTAS {
  const totalCalculationsCurrentYear = calculate(_calculations);
  const total = calculateTotalBalance(
    totalCalculationsCurrentYear,
    lastBalances
  );
  const totalBalances = calculation(
    { balances: lastBalances, calculations: _calculations },
    officialId
  );

  expect(currentCalculation.simpleHours.value.toString()).toBe(
    totalCalculationsCurrentYear.simple.toString()
  );
  expect(
    totalCalculationsCurrentYear.working.equals(
      currentCalculation.workingHours.value
    )
  ).toBeTruthy();
  expect(
    totalCalculationsCurrentYear.nonWorking.equals(
      currentCalculation.nonWorkingHours.value
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
