import { expect } from "vitest";

import Calculations from "../../../../collections/Calculations";
import { logger } from "../../../../config";
import BalanceConverter from "../../../../converters/models_to_entities/BalanceConverter";
import TypeOfYearToBalanceConverter from "../../../../converters/models_to_entities/TypeOfYearToBalanceConverter";
import MikroORMActualBalanceBuilder from "../../../../creators/actual/MikroORMActualBalanceBuilder";
import MikroORMHourlyBalanceBuilder from "../../../../creators/hourlyBalance/MikroORMHourlyBalanceBuilder";
import CalculationTAS from "../../../../entities/CalculationTAS";
import HourlyBalanceTAS from "../../../../entities/HourlyBalanceTAS";
import ActualHourlyBalanceRepository from "../../../../persistence/ActualBalance/ActualHourlyBalanceRepository";
import CalculationRepository from "../../../../persistence/Calculation/CalculationRepository";
import TASCalculator from "../../../../services/calculations/TAS";
import ActualHourlyBalanceCreator from "../../../../services/hourlyBalances/ActualHourlyBalanceCreator";
import ActualHourlyBalanceReplacer from "../../../../services/hourlyBalances/ActualHourlyBalanceReplacer";
import CalculationSorter from "../../../../sorters/CalculationSorter";
import { CalculationCalculated } from "../../../../types/calculations";
import CalculationValidator from "../CalculationValidator";
import CalculatorRowService from "../TAS/CalculatorRowService";
import HoursTASCalculator from "../TAS/HoursTASCalculator";
import RecalculatorService from "../TAS/RecalculatorService";
import BalancesPerYearCalculator from "../TAS/YearsCalculator";
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
  _calculations: Calculations<CalculationTAS>,
  {
    actualHourlyBalanceRepository,
    calculationRepository,
  }: {
    actualHourlyBalanceRepository: ActualHourlyBalanceRepository;
    calculationRepository: CalculationRepository;
  }
) {
  const actualHourlyBalanceBuilder = new MikroORMActualBalanceBuilder();

  const actualHourlyBalanceCreator = new ActualHourlyBalanceCreator({
    actualHourlyBalanceBuilder,
    hourlyBalanceBuilder: new MikroORMHourlyBalanceBuilder({
      actualHourlyBalanceBuilder,
    }),
  });
  const actualHourlyBalanceReplacer = new ActualHourlyBalanceReplacer({
    actualHourlyBalanceCreator,
    balanceConverter: new BalanceConverter(),
    typeOfYearToBalanceConverter: new TypeOfYearToBalanceConverter(),
  });
  const calculatorRowService = new CalculatorRowService({
    hoursTASCalculator: new HoursTASCalculator({
      balancesPerYearCalculator: new BalancesPerYearCalculator(),
      calculationRepository,
      calculationSorter: new CalculationSorter(),
      calculationValidator: new CalculationValidator(),
    }),
  });

  const recalculatorService = new RecalculatorService({
    actualHourlyBalanceReplacer,
    calculationRepository,
    calculatorRowService,
  });

  const tasCalculator = new TASCalculator({
    actualHourlyBalanceCreator,
    actualHourlyBalanceReplacer,
    recalculatorService,
    calculatorRowService,
    actualHourlyBalanceRepository,
  });

  const response = await tasCalculator.calculate({
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
  _calculations: Calculations<CalculationTAS>
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

  logger.info("simpleHours:", totalCalculationsCurrentYear.simple.toString());
  logger.info("workingHours:", totalCalculationsCurrentYear.working.toString());
  logger.info(
    "nonWorkingHours:",
    totalCalculationsCurrentYear.nonWorking.toString()
  );

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
  logger.info("Total Balances:", currentCalculation.totalBalance);
  expect(currentCalculation.totalBalance.toString()).toBe(
    total.totalHours.toString()
  );

  expectBalance(currentCalculation.balances).toBe(totalBalances.result);

  expectBalance(currentCalculation.balancesSanitized).toBe(
    totalBalances.resultSanitized
  );

  return totalBalances;
}
