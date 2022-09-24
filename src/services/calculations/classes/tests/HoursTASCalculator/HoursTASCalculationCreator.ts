import Decimal from "decimal.js";
import { Dictionary } from "lodash";

import Calculations from "../../../../../collections/Calculations";
import CalculationTAS from "../../../../../entities/CalculationTAS";
import HourlyBalanceTAS from "../../../../../entities/HourlyBalanceTAS";
import ActualHourlyBalanceRepository from "../../../../../persistence/ActualBalance/ActualHourlyBalanceRepository";
import CalculationRepository from "../../../../../persistence/Calculation/CalculationRepository";
import { expectCalculationEquals } from "../../../../../services/calculations/classes/tests/expect";
import calculation from "../../../../../services/calculations/classes/tests/HoursTASCalculator/calculate";
import { CalculationDataTAS } from "../../../../../services/calculations/classes/tests/HoursTASCalculator/HoursTASCalculator.test";
import {
  actualBalanceSecondTest,
  calculationsSecondTest,
  dateSecondTest,
  yearSecondTest,
} from "../../../../../services/calculations/classes/tests/HoursTASCalculator/initialValues";
import {
  buildOfficial,
  genRandomCalculations,
} from "../../../../../services/calculations/classes/tests/HoursTASCalculator/prepareData";
import { CalculationData } from "../../../../../services/calculations/classes/tests/HoursTASCalculator/types";
import {
  arrayWithoutElementAtIndex,
  hoursToSeconds,
} from "../../../../../services/calculations/classes/tests/HoursTASCalculator/util";
import { generateRandomUUIDV4 } from "../../../../../utils/strings";

export default class HoursTASCalculationCreator {
  private calculations: Dictionary<Array<CalculationTAS>> = {};
  private balances: CalculationDataTAS[] = [];
  private balancesRecalculated: CalculationData[] = [];

  constructor() {
    this.generateBalances();
  }

  private generateBalances() {
    const balances2019 = calculation({
      balances: [],
      calculations: new Calculations(...calculationsSecondTest),
    });

    this.balances.push(balances2019);

    this.calculations[balances2019.actualBalance.year] = [
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
    this.calculations[actualBalance2020.year] = [...calculation2020];

    this.balances.push(balances2020);

    const nextNextCalculations = genRandomCalculations(
      actualBalance2020.year + 1,
      generateRandomUUIDV4()
    );

    const balances2021 = calculation({
      balances: balances2020.balances,
      calculations: new Calculations(...nextNextCalculations),
    });

    this.calculations[balances2021.actualBalance.year] = [
      ...nextNextCalculations,
    ];
    this.balances.push(balances2021);
  }

  private reCalculateBalances() {
    const values = Object.values(this.calculations);

    let balances: HourlyBalanceTAS[] = [];
    for (const c of values) {
      const nextBalance = calculation({
        balances,
        calculations: new Calculations(...c),
      });

      balances = nextBalance.balances;
      this.balancesRecalculated.push(nextBalance);
    }
  }

  async prepareData() {
    const calculationFromPersistence = [...Object.values(this.calculations)];

    const calculationsToReplace: CalculationTAS[] =
      this.prepareCalculationsToReplace();

    const data = buildOfficial({
      calculations: calculationsToReplace,
      date: dateSecondTest,
      officialId: 1,
      year: yearSecondTest,
    });

    const balancesEnriched = this.balances.map((b) => b.actualBalance);

    const actualHourlyBalanceRepository: jest.Mocked<ActualHourlyBalanceRepository> =
      {
        filter: jest.fn(),
        add: jest.fn(),
        addRange: jest.fn(),
        get: jest.fn(),
        getAll: jest.fn(),
        remove: jest.fn(),
        removeRange: jest.fn(),
        set: jest.fn(),
        setRange: jest.fn(),
        clear: jest.fn(),
        getTASWithYearGreaterThanActual: jest
          .fn()
          .mockResolvedValue(balancesEnriched),
      };

    const firstCalculationsMock = calculationFromPersistence.flat();
    const secondCalculationsMock = calculationFromPersistence
      .flat()
      .filter((c) => c.year > actualBalanceSecondTest.year);

    const calculationRepository: jest.Mocked<CalculationRepository> = {
      filter: jest.fn(),
      add: jest.fn(),
      addRange: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      remove: jest.fn(),
      removeRange: jest.fn(),
      set: jest.fn(),
      setRange: jest.fn(),
      clear: jest.fn(),
      getCalculationWithYearGreaterThanActual: jest
        .fn()
        .mockResolvedValueOnce(firstCalculationsMock)
        .mockResolvedValueOnce(secondCalculationsMock),
      getCalculationsWithActualYear: jest
        .fn()
        .mockResolvedValue(calculationsSecondTest),
    };

    const calculationsModified = [
      ...arrayWithoutElementAtIndex(calculationsSecondTest, [2, 5, 11]),
      ...calculationsToReplace,
    ];

    const result = await expectCalculationEquals(
      { data, lastBalances: [] },
      new Calculations(...calculationsModified),
      {
        actualHourlyBalanceRepository,
        calculationRepository,
      }
    );

    this.calculations[actualBalanceSecondTest.year] = calculationsModified;
    this.reCalculateBalances();
    return {
      result,
      balancesRecalculated: this.balancesRecalculated,
      calculations: this.calculations,
    };
  }

  private prepareCalculationsToReplace() {
    const c1 = this.copy(calculationsSecondTest[2], {
      discount: new Decimal((hoursToSeconds(2) + 21n * 60n).toString()),
    });

    const c2 = this.copy(calculationsSecondTest[5], {
      discount: new Decimal(0),
    });

    const c3 = this.copy(calculationsSecondTest[11], {
      surplusNonWorking: new Decimal(
        (hoursToSeconds(3) + 44n * 60n).toString()
      ),
      surplusSimple: new Decimal((hoursToSeconds(4) + 55n * 60n).toString()),
    });

    return [c1, c2, c3];
  }

  private copy(
    source: CalculationTAS,
    { discount, surplusNonWorking, surplusSimple }: Partial<CalculationTAS>
  ) {
    return new CalculationTAS({
      id: source.id,
      year: source.year,
      month: source.month,
      surplusBusiness: source.surplusBusiness,
      surplusNonWorking: surplusNonWorking ?? source.surplusNonWorking,
      surplusSimple: surplusSimple ?? source.surplusSimple,
      discount: discount ?? source.discount,
      workingOvertime: source.workingOvertime,
      workingNightOvertime: source.workingNightOvertime,
      nonWorkingOvertime: source.nonWorkingOvertime,
      nonWorkingNightOvertime: source.nonWorkingNightOvertime,
      compensatedNightOvertime: source.compensatedNightOvertime,
      observations: source.observations,
      actualBalance: source.actualBalance,
    });
  }
}
