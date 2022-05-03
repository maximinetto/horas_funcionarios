import { CalculationCalculated, CalculationTAS } from "@/@types/calculations";
import CalculationTASConverter from "@/converters/CalculationTASConverter";
import calculateForTAS from "@/services/calculations/TAS";
import { Dictionary } from "lodash";
import calculation from "./calculate";
import { calculateTotalBalance } from "./calculateBalance";
import { calculate } from "./calculateForMonth";
import { converter } from "./convert";
import expectBalance from "./expectBalance";
import { convert } from "./hourlyBalanceToActualBalance";
import {
  actualBalance,
  actualBalanceSecondTest,
  calculationsFirstTest,
  calculationsSecondTest,
  dateFirstTest,
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
  logger,
} from "./util";

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
    let data = preset(calculationsFirstTest, yearFirstTest, dateFirstTest);
    actualBalanceRepository.getTAS.mockResolvedValue([
      convert(data.lastBalances, actualBalance.officialId),
    ]);
    expectCalculationEquals(data, calculationsFirstTest);
    calculationRepository.get.mockReset();
    actualBalanceRepository.getTAS.mockClear();

    calculationRepository.get.mockResolvedValue(calculationsFirstTest);
    data = preset(otherCalculations, yearFirstTest, dateFirstTest);
    actualBalanceRepository.getTAS.mockResolvedValue([
      convert(data.lastBalances, actualBalance.officialId),
    ]);
    const allCalculations = [...calculationsFirstTest, ...otherCalculations];
    expectCalculationEquals(data, allCalculations);
  });

  test("Should calculate right previous balances and next balances", async () => {
    const calculations: Dictionary<Array<CalculationTAS>> = {};
    const balances: CalculationData[] = [];
    const balancesRecalculated: CalculationData[] = [];

    function generate() {
      const firstBalance = calculation(
        {
          balances: [],
          calculations: converter(calculationsSecondTest),
        },
        actualBalanceSecondTest.officialId
      );

      balances.push(firstBalance);

      logger(firstBalance);

      calculations[firstBalance.actualBalance.year - 1] = [
        ...calculationsSecondTest,
      ];

      const actualBalance2020 = firstBalance.actualBalance;

      const nextCalculations = genRandomCalculations(
        actualBalance2020.year,
        generateRandomUUIDV4()
      );

      const nextBalance = calculation(
        {
          balances: firstBalance.balances,
          calculations: converter(nextCalculations),
        },
        actualBalanceSecondTest.officialId
      );

      calculations[nextBalance.actualBalance.year - 1] = [...nextCalculations];

      const actualBalance2021 = nextBalance.actualBalance;
      balances.push(nextBalance);

      const nextNextCalculations = genRandomCalculations(
        actualBalance2021.year,
        generateRandomUUIDV4()
      );

      const nextNextBalance = calculation(
        {
          balances: nextBalance.balances,
          calculations: converter(nextNextCalculations),
        },
        actualBalanceSecondTest.officialId
      );

      calculations[nextNextBalance.actualBalance.year - 1] = [
        ...nextNextCalculations,
      ];
      balances.push(nextNextBalance);
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

    const balancesEnriched = balances.map((b) =>
      convert(b.balances, actualBalanceSecondTest.officialId)
    );

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

    // expectCurrentActualBalanceEquals(
    //   hourlyBalanceFrom2019To2020.balances.map((b) => {
    //     const balances = result.balancesCalculated.balances;
    //     const balance = balances.find((bn) => bn.year === b.year);
    //     if (!balance) {
    //       throw new Error("Balance not found");
    //     }

    //     const hourlyBalance = balance.hourlyBalanceTAS;

    //     return {
    //       actualBalanceId: b.actualBalanceId,
    //       id: b.id,
    //       year: b.year,
    //       hourlyBalanceTAS: {
    //         simple: hourlyBalance.simple,
    //         working: hourlyBalance.working,
    //         nonWorking: hourlyBalance.nonWorking,
    //         hourlyBalanceId: b.hourlyBalanceTAS.hourlyBalanceId,
    //         id: b.hourlyBalanceTAS.id,
    //       },
    //     };
    //   }),
    //   result.others[0],
    //   nextCalculations
    // );

    // logger(
    //   hourlyBalanceFrom2019To2021.balances,
    //   result.others[1],
    //   nextNextCalculations
    // );

    // expectCurrentActualBalanceEquals(
    //   hourlyBalanceFrom2019To2021.balances,
    //   result.others[1],
    //   nextNextCalculations
    // );

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

    // const calculator = new CalculateForTAS(calculationRepository);

    // const response = await calculator.calculate({
    //   ...data,
    //   hourlyBalances: [...lastBalances],
    // });

    const currentYear = response.currentYear;

    const balances = expectCurrentActualBalanceEquals(
      lastBalances,
      currentYear,
      _calculations,
      data.official.id
    );

    return { others: response.others, balancesCalculated: balances };
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

    expectBalance(currentCalculation.balances).toBe(totalBalances.result);

    expectBalance(currentCalculation.balancesSanitized).toBe(
      totalBalances.resultSanitized
    );

    return totalBalances;
  }
});
