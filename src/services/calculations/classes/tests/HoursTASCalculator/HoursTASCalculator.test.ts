import Calculations from "collections/Calculations";
import ActualBalance from "entities/ActualBalance";
import { ActualHourlyBalanceRepository } from "persistence/actualBalance";
import { CalculationRepository } from "persistence/calculations";
import HoursTASCalculationCreator from "services/calculations/classes/tests/HoursTASCalculator/HoursTASCalculationCreator";

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
    jest
      .spyOn(CalculationRepository.prototype, "get")
      .mockResolvedValue(new Calculations());

    const firstData = new Calculations(...calculationsFirstTest);

    const data = preset(firstData, yearFirstTest);
    ActualHourlyBalanceRepository.prototype.getTAS = jest
      .fn()
      .mockResolvedValue([convert(data.lastBalances, data.data.official)]);

    await expectCalculationEquals(
      data,
      new Calculations(...calculationsFirstTest)
    );
  });
  test("Should calculate right the passed values too", async () => {
    jest
      .spyOn(CalculationRepository.prototype, "get")
      .mockResolvedValue(new Calculations(...calculationsFirstTest));

    const otherData = new Calculations(...otherCalculations);
    const data = preset(otherData, yearFirstTest);
    const actual = convert(data.lastBalances, data.data.official);
    jest
      .spyOn(ActualHourlyBalanceRepository.prototype, "getTAS")
      .mockResolvedValue([actual]);
    const allCalculations = [...calculationsFirstTest, ...otherCalculations];
    await expectCalculationEquals(data, new Calculations(...allCalculations));
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
