import { CalculationCalculated } from "@/@types/calculations";
import CalculationTAS from "@/entities/CalculationTAS";
import calculateForTAS from "../../TAS";
import calculation from "./CalculateForTAS/calculate";
import { calculateTotalBalance } from "./CalculateForTAS/calculateBalance";
import { calculate } from "./CalculateForTAS/calculateForMonth";
import { CalculationDataTAS } from "./CalculateForTAS/CalculateForTAS.test";
import expectBalance from "./CalculateForTAS/expectBalance";
import { actualBalanceRepository } from "./CalculateForTAS/mock";
import { HourlyBalanceTASNotNullable, Result } from "./CalculateForTAS/types";

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

  console.log("after expect");

  expectBalance(currentCalculation.balances).toBe(totalBalances.result);

  expectBalance(currentCalculation.balancesSanitized).toBe(
    totalBalances.resultSanitized
  );

  return totalBalances;
}
