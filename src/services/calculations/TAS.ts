import { CalculationCalculated, CalculationTAS } from "@/@types/calculations";
import {
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "@/@types/typeOfHours";
import BalanceConverter from "@/converters/BalanceConverter";
import { convertTypesOfYearsToActualBalance } from "@/converters/TypeOfYearToBalanceConverter";
import { ActualBalanceRepository } from "@/persistence/actualBalance";
import { CalculationRepository } from "@/persistence/calculations";
import CalculateForTas from "@/services/calculations/classes/CalculateForTAS";
import CalculationRowService from "@/services/calculations/classes/CalculationRowService";
import {
  Calculation,
  HourlyBalance,
  HourlyBalanceTAS,
  Official,
} from "@prisma/client";
import _groupBy from "lodash/groupBy";
import { balances } from "../hourlyBalances";
import { logger } from "./classes/tests/CalculateForTAS/util";

export default async function calculateForTAS({
  year,
  official,
  calculations,
  calculationRowService = new CalculationRowService(),
  calculationRepository = new CalculationRepository(),
  actualBalanceRepository = new ActualBalanceRepository(),
  balanceConverter = new BalanceConverter(),
}: {
  year: number;
  official: Official;
  calculations: CalculationTAS[];
  calculationRowService?: CalculationRowService;
  calculationRepository?: CalculationRepository;
  actualBalanceRepository?: ActualBalanceRepository;
  balanceConverter?: BalanceConverter;
}) {
  const actualHourlyBalancesResult: {
    hourlyBalances: (HourlyBalance & {
      hourlyBalanceTAS: HourlyBalanceTAS | null;
    })[];
    id: string;
    year: number;
    total: bigint;
    officialId: number;
  }[] = [];

  let actualHourlyBalances: {
    hourlyBalances: (HourlyBalance & {
      hourlyBalanceTAS: HourlyBalanceTAS | null;
    })[];
    id: string;
    year: number;
    total: bigint;
    officialId: number;
  }[];

  async function main() {
    actualHourlyBalances = await balances({
      year,
      officialId: official.id,
      actualBalanceRepository,
    });

    const actualHourlyBalance = actualHourlyBalances.find(
      (a) => a.year === year
    );
    const calculateService = new CalculateForTas(calculationRepository);
    const dataCalculated = await calculationRowService.calculate(
      { year, official, calculations, actualHourlyBalance },
      calculateService
    );

    save([dataCalculated]);

    replaceActualHourlyBalance(dataCalculated.balances);

    const nextYear = year + 1;
    const postCalculatedData = await tryToRecalculateLaterHours(
      { official, year: nextYear },
      calculateService,
      calculationRepository
    );
    if (postCalculatedData) save(postCalculatedData);

    return {
      currentYear: dataCalculated,
      others: postCalculatedData ? postCalculatedData : [],
      actualHourlyBalances: actualHourlyBalancesResult,
    };
  }

  async function tryToRecalculateLaterHours(
    { official, year }: { official: Official; year: number },
    calculateService: CalculateForTas,
    calculationRepository: CalculationRepository
  ) {
    const dataToSave: CalculationCalculated[] = [];

    const calculations = await calculationRepository.get(
      {
        year: {
          gte: year,
        },
        actualBalance: {
          officialId: official.id,
        },
      },
      {
        include: {
          calculationTAS: true,
        },
      }
    );

    if (!hasMoreLaterHours(calculations)) return;

    const currentCalculations = _groupBy(calculations, "year");

    const entries = Object.entries(currentCalculations);
    entries.sort(([ya], [yb]) => Number(ya) - Number(yb));

    let i = 0;
    for (const [year, calculations] of entries) {
      const actualHourlyBalance =
        actualHourlyBalancesResult[actualHourlyBalancesResult.length - 1];

      logger(
        `Recalculating for year ${year}`,
        actualHourlyBalance,
        calculations[0]
      );

      const data = await calculationRowService.reCalculate(
        {
          calculations: [],
          official,
          actualHourlyBalance,
          year,
          calculationsFromPersistence: calculations,
        },
        calculateService
      );

      replaceActualHourlyBalance(data.balances);
      dataToSave.push(data);
      i++;
    }

    return dataToSave;
  }

  function replaceActualHourlyBalance(
    balances: (TypeOfHoursByYearDecimal | TypeOfHoursByYear)[]
  ) {
    const balancesSortedByYear = balances.sort((a, b) => a.year - b.year);
    const balanceNewer = balancesSortedByYear[balancesSortedByYear.length - 1];
    const currentBalance = actualHourlyBalances.find(
      (a) => a.year === balanceNewer.year + 1
    );

    if (!currentBalance) throw new Error("Internal error. Must have a balance");

    const enrichBalances = balanceConverter.fromBigIntToDecimal(balances);
    const currentActualBalance = convertTypesOfYearsToActualBalance(
      currentBalance,
      enrichBalances
    );

    actualHourlyBalancesResult.push(currentActualBalance);
  }

  function hasMoreLaterHours(calculations: Calculation[]) {
    return calculations.length > 0;
  }
  return main();
}

function save(calculations: CalculationCalculated[]) {}
