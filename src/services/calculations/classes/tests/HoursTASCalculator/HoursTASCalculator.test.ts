import ActualBalanceTAS from "entities/ActualBalanceTAS";
import { describe, test } from "vitest";
import { mock } from "vitest-mock-extended";

import Calculations from "../../../../../collections/Calculations";
import ActualBalance from "../../../../../entities/ActualBalance";
import ActualHourlyBalanceRepository from "../../../../../persistence/ActualBalance/ActualHourlyBalanceRepository";
import CalculationRepository from "../../../../../persistence/Calculation/CalculationRepository";
import HoursTASCalculationCreator from "../../../../../services/calculations/classes/tests/HoursTASCalculator/HoursTASCalculationCreator";
import {
  expectCalculationEquals,
  expectCurrentActualBalanceEquals,
} from "../expect";
import { convert } from "./hourlyBalanceToActualBalance";
import {
  actualBalanceSecondTest,
  calculationsFirstTest,
  otherCalculations,
  yearFirstTest,
} from "./initialValues";
import { preset } from "./prepareData";
import { CalculationData, HourlyBalanceTASNotNullable } from "./types";

export interface ActualBalanceComplete {
  id: string;
  officialId: number;
  year: number;
  total: bigint;
  hourlyBalances: HourlyBalanceTASNotNullable[];
}
export interface CalculationDataTAS extends CalculationData {
  actualBalance: ActualBalance;
}

describe("Test calculations", () => {
  test("Should calculate right the passed values", async () => {
    const firstData = new Calculations(...calculationsFirstTest);

    const data = preset(firstData, yearFirstTest);

    const actualHourlyBalanceRepository = mock<ActualHourlyBalanceRepository>();
    actualHourlyBalanceRepository.getTASWithYearGreaterThanActual.mockResolvedValue(
      [convert(data.lastBalances, data.data.official) as ActualBalanceTAS]
    );

    const calculationRepository = mock<CalculationRepository>();
    calculationRepository.getCalculationWithYearGreaterThanActual.mockResolvedValue(
      []
    );
    calculationRepository.getCalculationsWithActualYear.mockResolvedValue([]);

    await expectCalculationEquals(
      data,
      new Calculations(...calculationsFirstTest),
      {
        actualHourlyBalanceRepository,
        calculationRepository,
      }
    );
  });
  test("Should calculate right the passed values too", async () => {
    const calculationRepository = mock<CalculationRepository>();
    calculationRepository.getCalculationWithYearGreaterThanActual.mockResolvedValue(
      []
    );
    calculationRepository.getCalculationsWithActualYear.mockResolvedValue(
      calculationsFirstTest
    );

    const otherData = new Calculations(...otherCalculations);
    const data = preset(otherData, yearFirstTest);
    const actual = convert(data.lastBalances, data.data.official);

    const actualHourlyBalanceRepository = mock<ActualHourlyBalanceRepository>();
    actualHourlyBalanceRepository.getTASWithYearGreaterThanActual.mockResolvedValue(
      [actual as ActualBalanceTAS]
    );

    const allCalculations = [...calculationsFirstTest, ...otherCalculations];
    await expectCalculationEquals(data, new Calculations(...allCalculations), {
      actualHourlyBalanceRepository,
      calculationRepository,
    });
  });

  test("Should calculate right previous balances and next balances", async () => {
    const hoursTASCalculationCreator = new HoursTASCalculationCreator();
    const { balancesRecalculated, calculations, result } =
      await hoursTASCalculationCreator.prepareData();

    expectCurrentActualBalanceEquals(
      balancesRecalculated[0].balances,
      result.others[0],
      new Calculations(...calculations[actualBalanceSecondTest.year + 1])
    );

    expectCurrentActualBalanceEquals(
      balancesRecalculated[1].balances,
      result.others[1],
      new Calculations(...calculations[actualBalanceSecondTest.year + 2])
    );
  });
});
