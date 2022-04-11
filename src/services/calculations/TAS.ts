import { CalculationCalculated, CalculationTAS } from "@/@types/calculations";
import { calculationTasFromArray } from "@/mappers/EntityToDTO";
import { operations as balanceRepository } from "@/persistence/actualBalance";
import { CalculationRepository } from "@/persistence/calculations";
import CalculateForTas from "@/services/calculations/classes/CalculateForTAS";
import { Calculation, Official } from "@prisma/client";
import _groupBy from "lodash/groupBy";

const calculationRepository = new CalculationRepository();

export default async function calculateForTAS({
  year,
  official,
  calculations,
}: {
  year: number;
  official: Official;
  calculations: CalculationTAS[];
}) {
  const hourlyBalances = await balances({ year, officialId: official.id });
  const calculateService = new CalculateForTas(calculationRepository);
  const dataCalculated = await calculate(
    { year, official, calculations, hourlyBalances },
    calculateService
  );
  save([dataCalculated]);
  const postCalculatedData = await tryToRecalculateLaterHours(
    { official, year },
    dataCalculated.balancesSanitized,
    calculateService
  );
  if (postCalculatedData) save(postCalculatedData);

  return dataCalculated;
}

async function tryToRecalculateLaterHours(
  { official, year }: { official: Official; year: number },
  balances: any[],
  calculateService: CalculateForTas
) {
  const dataToSave: CalculationCalculated[] = [];

  const calculations = await calculationRepository.get(
    {
      year: {
        gt: year,
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

  Object.entries(currentCalculations).map(async ([year, calculations]) => {
    const data = await reCalculate(
      {
        calculations,
        official,
        balances: balances.filter((balance) => balance.year === Number(year)),
        year,
      },
      calculateService
    );
    dataToSave.push(data);
  });

  return dataToSave;
}

function hasMoreLaterHours(calculations: Calculation[]) {
  return calculations.length > 0;
}

async function calculate(
  {
    year,
    official,
    calculations,
    hourlyBalances,
  }: {
    year: number;
    official: Official;
    calculations: CalculationTAS[];
    hourlyBalances: any;
  },
  calculateService: CalculateForTas
) {
  return calculateService.calculate({
    year,
    official,
    calculations,
    hourlyBalances,
  });
}

async function balances({
  year,
  officialId,
}: {
  year: number;
  officialId: number;
}) {
  const lastActualBalances =
    await balanceRepository.getBalanceTASBYOfficialIdAndYear({
      officialId: officialId,
      year,
    });

  return lastActualBalances.length === 0
    ? { hourlyBalanceTAS: [] }
    : lastActualBalances[0].hourlyBalances;
}

function save(calculations: CalculationCalculated[]) {}

function reCalculate(
  {
    calculations,
    official,
    balances,
    year,
  }: {
    calculations: Calculation[];
    official: Official;
    balances: any[];
    year: string;
  },
  calculateService: CalculateForTas
) {
  return calculate(
    {
      calculations: calculationTasFromArray(calculations),
      official,
      hourlyBalances: balances,
      year: Number(year),
    },
    calculateService
  );
}
