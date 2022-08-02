import Calculations from "collections/Calculations";
import ActualBalance from "entities/ActualBalance";
import ActualHourlyBalanceRepository from "persistence/ActualBalance/ActualHourlyBalanceRepository";
import CalculationRepository from "persistence/Calculation/CalculationRepository";
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
    const calculationRepository: jest.Mocked<CalculationRepository> = {
      filter: jest.fn().mockResolvedValue([]),
      add: jest.fn(),
      addRange: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      remove: jest.fn(),
      removeRange: jest.fn(),
      set: jest.fn(),
      setRange: jest.fn(),
    };

    const firstData = new Calculations(...calculationsFirstTest);

    const data = preset(firstData, yearFirstTest);

    const actualHourlyBalanceRepository: jest.Mocked<ActualHourlyBalanceRepository> =
      {
        filter: jest
          .fn()
          .mockResolvedValue([convert(data.lastBalances, data.data.official)]),
        add: jest.fn(),
        addRange: jest.fn(),
        get: jest.fn(),
        getAll: jest.fn(),
        remove: jest.fn(),
        removeRange: jest.fn(),
        set: jest.fn(),
        setRange: jest.fn(),
      };

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
    const calculationRepository: jest.Mocked<CalculationRepository> = {
      filter: jest.fn().mockResolvedValue(calculationsFirstTest),
      add: jest.fn(),
      addRange: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      remove: jest.fn(),
      removeRange: jest.fn(),
      set: jest.fn(),
      setRange: jest.fn(),
    };

    const otherData = new Calculations(...otherCalculations);
    const data = preset(otherData, yearFirstTest);
    const actual = convert(data.lastBalances, data.data.official);

    const actualHourlyBalanceRepository: jest.Mocked<ActualHourlyBalanceRepository> =
      {
        filter: jest.fn().mockResolvedValue([actual]),
        add: jest.fn(),
        addRange: jest.fn(),
        get: jest.fn(),
        getAll: jest.fn(),
        remove: jest.fn(),
        removeRange: jest.fn(),
        set: jest.fn(),
        setRange: jest.fn(),
      };

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
