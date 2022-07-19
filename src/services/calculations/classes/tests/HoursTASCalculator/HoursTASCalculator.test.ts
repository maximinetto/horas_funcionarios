import Decimal from "decimal.js";
import { Dictionary } from "lodash";

import Calculations from "@/collections/Calculations";
import ActualBalance from "@/entities/ActualBalance";
import CalculationTAS from "@/entities/CalculationTAS";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
import { ActualBalanceRepository } from "@/persistence/actualBalance";
import { CalculationRepository } from "@/persistence/calculations";
import { generateRandomUUIDV4 } from "@/utils/strings";

import {
  expectCalculationEquals,
  expectCurrentActualBalanceEquals,
} from "../expect";
import calculation from "./calculate";
import { convert } from "./hourlyBalanceToActualBalance";
import {
  actualBalanceSecondTest,
  calculationsFirstTest,
  calculationsSecondTest,
  dateSecondTest,
  otherCalculations,
  yearFirstTest,
  yearSecondTest,
} from "./initialValues";
import { buildOfficial, genRandomCalculations, preset } from "./prepareData";
import { CalculationData, HourlyBalanceTASNotNullable } from "./types";
import { arrayWithoutElementAtIndex, hoursToSeconds } from "./util";

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

function copy(
  source: CalculationTAS,
  { discount, surplusNonWorking, surplusSimple }: Partial<CalculationTAS>
) {
  return new CalculationTAS(
    source.id,
    source.year,
    source.month,
    source.surplusBusiness,
    surplusNonWorking ?? source.surplusNonWorking,
    surplusSimple ?? source.surplusSimple,
    discount ?? source.discount,
    source.workingOvertime,
    source.workingNightOvertime,
    source.nonWorkingOvertime,
    source.nonWorkingNightOvertime,
    source.compensatedNightOvertime,
    source.calculationId,
    source.observations,
    source.actualBalance.get()
  );
}

function prepareCalculationsToReplace() {
  const c1 = copy(calculationsSecondTest[2], {
    discount: new Decimal((hoursToSeconds(2) + 21n * 60n).toString()),
  });

  const c2 = copy(calculationsSecondTest[5], {
    discount: new Decimal(0),
  });

  const c3 = copy(calculationsSecondTest[11], {
    surplusNonWorking: new Decimal((hoursToSeconds(3) + 44n * 60n).toString()),
    surplusSimple: new Decimal((hoursToSeconds(4) + 55n * 60n).toString()),
  });

  return [c1, c2, c3];
}

describe("Test calculations", () => {
  test("Should calculate right the passed values", async () => {
    jest
      .spyOn(CalculationRepository.prototype, "get")

      .mockResolvedValue(new Calculations());

    const firstData = new Calculations(...calculationsFirstTest);

    let data = preset(firstData, yearFirstTest);
    ActualBalanceRepository.prototype.getTAS = jest
      .fn()
      .mockResolvedValue([convert(data.lastBalances, data.data.official)]);

    await expectCalculationEquals(
      data,
      new Calculations(...calculationsFirstTest)
    );

    jest
      .spyOn(CalculationRepository.prototype, "get")

      .mockResolvedValue(new Calculations(...calculationsFirstTest));

    const otherData = new Calculations(...otherCalculations);
    data = preset(otherData, yearFirstTest);
    const actual = convert(data.lastBalances, data.data.official);
    jest
      .spyOn(ActualBalanceRepository.prototype, "getTAS")
      .mockResolvedValue([actual]);
    const allCalculations = [...calculationsFirstTest, ...otherCalculations];
    await expectCalculationEquals(data, new Calculations(...allCalculations));
  });

  test("Should calculate right previous balances and next balances", async () => {
    const calculations: Dictionary<Array<CalculationTAS>> = {};
    const balances: CalculationDataTAS[] = [];
    const balancesRecalculated: CalculationData[] = [];

    function generate() {
      const balances2019 = calculation({
        balances: [],
        calculations: new Calculations(...calculationsSecondTest),
      });

      balances.push(balances2019);

      calculations[balances2019.actualBalance.year] = [
        ...calculationsSecondTest,
      ];

      const actualBalance2019 = balances2019.actualBalance;

      const calculation2020 = genRandomCalculations(
        actualBalance2019.year + 1,
        generateRandomUUIDV4()
      );

      const balances2020 = calculation({
        balances: balances2019.balances,
        calculations: new Calculations(...calculation2020),
      });

      const actualBalance2020 = balances2020.actualBalance;
      calculations[actualBalance2020.year] = [...calculation2020];

      balances.push(balances2020);

      const nextNextCalculations = genRandomCalculations(
        actualBalance2020.year + 1,
        generateRandomUUIDV4()
      );

      const balances2021 = calculation({
        balances: balances2020.balances,
        calculations: new Calculations(...nextNextCalculations),
      });

      calculations[balances2021.actualBalance.year] = [...nextNextCalculations];
      balances.push(balances2021);
    }

    function reCalculate() {
      const values = Object.values(calculations);

      let balances: HourlyBalanceTAS[] = [];
      for (const c of values) {
        const nextBalance = calculation({
          balances,
          calculations: new Calculations(...c),
        });

        balances = nextBalance.balances;
        balancesRecalculated.push(nextBalance);
      }
    }

    generate();

    const calculationFromPersistence = [...Object.values(calculations)];

    const calculationsToReplace: CalculationTAS[] =
      prepareCalculationsToReplace();

    const data = buildOfficial({
      calculations: calculationsToReplace,
      date: dateSecondTest,
      officialId: 1,
      year: yearSecondTest,
    });

    const balancesEnriched = balances.map((b) => b.actualBalance);

    jest
      .spyOn(ActualBalanceRepository.prototype, "getTAS")
      .mockResolvedValue(balancesEnriched);

    const firstCalculationsMock = calculationFromPersistence.flat();
    const secondCalculationsMock = calculationFromPersistence
      .flat()
      .filter((c) => c.year > actualBalanceSecondTest.year);

    jest
      .spyOn(CalculationRepository.prototype, "get")
      .mockResolvedValueOnce(new Calculations(...firstCalculationsMock))
      .mockResolvedValueOnce(new Calculations(...secondCalculationsMock));

    const calculationsModified = [
      ...arrayWithoutElementAtIndex(calculationsSecondTest, [2, 5, 11]),
      ...calculationsToReplace,
    ];

    const result = await expectCalculationEquals(
      { data, lastBalances: [] },
      new Calculations(...calculationsModified)
    );

    calculations[actualBalanceSecondTest.year] = calculationsModified;
    reCalculate();

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
