import CalculationTAS from "@/entities/CalculationTAS";
import { CalculationRepository } from "@/persistence/calculations";
import Decimal from "decimal.js";
import { Dictionary } from "lodash";
import {
  expectCalculationEquals,
  expectCurrentActualBalanceEquals,
} from "../expect";
import calculation from "./calculate";
import { convert } from "./hourlyBalanceToActualBalance";
import {
  actualBalance,
  actualBalanceSecondTest,
  calculationsFirstTest,
  calculationsSecondTest,
  dateSecondTest,
  otherCalculations,
  yearFirstTest,
  yearSecondTest,
} from "./initialValues";
import { actualBalanceRepository } from "./mock";
import { buildOfficial, genRandomCalculations, preset } from "./prepareData";
import { CalculationData, HourlyBalanceTASNotNullable } from "./types";
import {
  arrayWithoutElementAtIndex,
  generateRandomUUIDV4,
  hoursToSeconds,
} from "./util";

export interface ActualBalanceComplete {
  id: string;
  officialId: number;
  year: number;
  total: bigint;
  hourlyBalances: HourlyBalanceTASNotNullable[];
}
export interface CalculationDataTAS extends CalculationData {
  actualBalance: ActualBalanceComplete;
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
  beforeEach(() => {
    actualBalanceRepository.getTAS.mockReset();
    BigInt.prototype["toJSON"] = function () {
      return this.toString();
    };
  });

  test("Should calculate right the passed values", async () => {
    CalculationRepository.prototype.get = jest.fn().mockResolvedValue([]);
    let data = preset(calculationsFirstTest, yearFirstTest);
    actualBalanceRepository.getTAS.mockResolvedValue([
      convert(data.lastBalances, actualBalance.officialId),
    ]);
    await expectCalculationEquals(data, calculationsFirstTest);
    actualBalanceRepository.getTAS.mockClear();

    CalculationRepository.prototype.get = jest
      .fn()
      .mockResolvedValue(calculationsFirstTest);
    data = preset(otherCalculations, yearFirstTest);
    actualBalanceRepository.getTAS.mockResolvedValue([
      convert(data.lastBalances, actualBalance.officialId),
    ]);
    const allCalculations = [...calculationsFirstTest, ...otherCalculations];
    await expectCalculationEquals(data, allCalculations);
  });

  test("Should calculate right previous balances and next balances", async () => {
    const calculations: Dictionary<Array<CalculationTAS>> = {};
    const balances: CalculationDataTAS[] = [];
    const balancesRecalculated: CalculationData[] = [];

    function generate() {
      const balances2019 = calculation(
        {
          balances: [],
          calculations: calculationsSecondTest,
        },
        actualBalanceSecondTest.officialId
      );

      balances.push(balances2019);

      calculations[balances2019.actualBalance.year] = [
        ...calculationsSecondTest,
      ];

      const actualBalance2019 = balances2019.actualBalance;

      const calculation2020 = genRandomCalculations(
        actualBalance2019.year + 1,
        generateRandomUUIDV4()
      );

      const balances2020 = calculation(
        {
          balances: balances2019.balances,
          calculations: calculation2020,
        },
        actualBalanceSecondTest.officialId
      );

      const actualBalance2020 = balances2020.actualBalance;
      calculations[actualBalance2020.year] = [...calculation2020];

      balances.push(balances2020);

      const nextNextCalculations = genRandomCalculations(
        actualBalance2020.year + 1,
        generateRandomUUIDV4()
      );

      const balances2021 = calculation(
        {
          balances: balances2020.balances,
          calculations: nextNextCalculations,
        },
        actualBalanceSecondTest.officialId
      );

      calculations[balances2021.actualBalance.year] = [...nextNextCalculations];
      balances.push(balances2021);
    }

    function reCalculate() {
      const values = Object.values(calculations);

      let i = 0;
      let balances: HourlyBalanceTASNotNullable[] = [];
      for (const c of values) {
        const nextBalance = calculation(
          {
            balances,
            calculations: c,
          },
          actualBalanceSecondTest.officialId
        );

        balances = nextBalance.balances;
        balancesRecalculated.push(nextBalance);
        i++;
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

    actualBalanceRepository.getTAS.mockResolvedValue(balancesEnriched);

    CalculationRepository.prototype.get = jest
      .fn()
      .mockResolvedValueOnce(calculationFromPersistence.flat())
      .mockResolvedValueOnce(
        calculationFromPersistence
          .flat()
          .filter((c) => c.year > actualBalanceSecondTest.year)
      );

    const calculationsModified = [
      ...arrayWithoutElementAtIndex(calculationsSecondTest, [2, 5, 11]),
      ...calculationsToReplace,
    ];

    const result = await expectCalculationEquals(
      { data, lastBalances: [] },
      calculationsModified
    );

    calculations[actualBalanceSecondTest.year] = calculationsModified;
    reCalculate();

    expectCurrentActualBalanceEquals(
      balancesRecalculated[0].balances,
      result.others[0],
      calculations[actualBalanceSecondTest.year + 1]
    );

    expectCurrentActualBalanceEquals(
      balancesRecalculated[1].balances,
      result.others[1],
      calculations[actualBalanceSecondTest.year + 2]
    );

    // calculationRepository.get.mockReset();
  });
});
