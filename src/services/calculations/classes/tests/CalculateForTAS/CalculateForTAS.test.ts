import { CalculationCalculated, CalculationTAS } from "@/@types/calculations";
import CalculationTASConverter from "@/converters/CalculationTASConverter";
import calculateForTAS from "@/services/calculations/TAS";
import { Dictionary } from "lodash";
import calculation from "./calculate";
import { calculateTotalBalance } from "./calculateBalance";
import { calculate } from "./calculateForMonth";
import { converter } from "./convert";
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
import { actualBalanceRepository, calculationRepository } from "./mock";
import { buildOfficial, genRandomCalculations, preset } from "./prepareData";
import { CalculationData, HourlyBalanceTASNotNullable, Result } from "./types";
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

describe("Test calculations", () => {
  beforeEach(() => {
    calculationRepository.get.mockReset();
    actualBalanceRepository.getTAS.mockReset();
    BigInt.prototype["toJSON"] = function () {
      return this.toString();
    };
  });

  test("Should calculate right the passed values", async () => {
    calculationRepository.get.mockResolvedValue([]);
    let data = preset(calculationsFirstTest, yearFirstTest);
    actualBalanceRepository.getTAS.mockResolvedValue([
      convert(data.lastBalances, actualBalance.officialId),
    ]);
    expectCalculationEquals(data, calculationsFirstTest);
    calculationRepository.get.mockReset();
    actualBalanceRepository.getTAS.mockClear();

    calculationRepository.get.mockResolvedValue(calculationsFirstTest);
    data = preset(otherCalculations, yearFirstTest);
    actualBalanceRepository.getTAS.mockResolvedValue([
      convert(data.lastBalances, actualBalance.officialId),
    ]);
    const allCalculations = [...calculationsFirstTest, ...otherCalculations];
    expectCalculationEquals(data, allCalculations);
  });

  test("Should calculate right previous balances and next balances", async () => {
    const calculations: Dictionary<Array<CalculationTAS>> = {};
    const balances: CalculationDataTAS[] = [];
    const balancesRecalculated: CalculationData[] = [];

    function generate() {
      const balances2019 = calculation(
        {
          balances: [],
          calculations: converter(calculationsSecondTest),
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
          calculations: converter(calculation2020),
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
          calculations: converter(nextNextCalculations),
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
            calculations: converter(c),
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

    const calculationsToReplace = [
      {
        ...calculationsSecondTest[2],
        discount: hoursToSeconds(2) + 21n * 60n,
      },
      {
        ...calculationsSecondTest[5],
        discount: 0n,
      },
      {
        ...calculationsSecondTest[11],
        surplusNonWorking: hoursToSeconds(3) + 44n * 60n,
        surplusSimple: hoursToSeconds(4) + 55n * 60n,
      },
    ];

    const data = buildOfficial({
      calculations: calculationsToReplace,
      date: dateSecondTest,
      officialId: 1,
      year: yearSecondTest,
    });

    const balancesEnriched = balances.map((b) => b.actualBalance);

    actualBalanceRepository.getTAS.mockResolvedValue(balancesEnriched);

    calculationRepository.get
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

    calculationRepository.get.mockReset();
  });

  async function expectCalculationEquals(
    { lastBalances, data }: Result,
    _calculations: CalculationTAS[]
  ) {
    const response = await calculateForTAS({
      calculations: data.calculations,
      official: data.official,
      year: data.year,
      calculationRepository: calculationRepository,
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

  function expectCurrentActualBalanceEquals(
    lastBalances: HourlyBalanceTASNotNullable[],
    currentCalculation: CalculationCalculated,
    _calculations: CalculationTAS[],
    officialId: number = 1
  ) {
    const converter = new CalculationTASConverter();
    const calculations = converter.fromModelsToEntities(_calculations);

    const totalCalculationsCurrentYear = calculate(_calculations);
    const total = calculateTotalBalance(
      totalCalculationsCurrentYear,
      lastBalances
    );
    const totalBalances = calculation(
      { balances: lastBalances, calculations },
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

    // expectBalance(currentCalculation.balances).toBe(totalBalances.result);

    // expectBalance(currentCalculation.balancesSanitized).toBe(
    //   totalBalances.resultSanitized
    // );

    return totalBalances;
  }
});
