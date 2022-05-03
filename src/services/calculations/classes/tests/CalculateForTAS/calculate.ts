import { ActualBalanceDTO } from "@/@types/actualBalance";
import CalculationTASConverter from "@/converters/CalculationTASConverter";
import CalculationTAS from "@/entities/CalculationTAS";
import subtractHoursFromBalance from "./calculateBalance";
import { calculate } from "./calculateForMonth";
import { CalculationData, HourlyBalanceTASNotNullable } from "./types";
import { generateRandomUUIDV4 } from "./util";

export default function calculation(
  {
    balances,
    calculations,
  }: {
    balances: HourlyBalanceTASNotNullable[];
    calculations: CalculationTAS[];
  },
  officialId: number
): CalculationData {
  if (balances.length === 0 && calculations.length === 0) {
    return {
      result: [],
      resultSanitized: [],
      balances: [],
      balancesSanitized: [],
      actualBalance: {
        id: generateRandomUUIDV4(),
        officialId,
        year: 0,
        total: 0n,
        hourlyBalances: [],
      },
    };
  }

  const converter = new CalculationTASConverter();
  const calculationsConverted = converter.fromEntitiesToModels(calculations);
  const calculationsCalculated = calculate(calculationsConverted);

  const actualBalanceId = calculations[0].actualBalance.get().id;

  const year = calculations[0].year;
  const balanceId = generateRandomUUIDV4();

  const newBalances: HourlyBalanceTASNotNullable[] = balances.map((b) => {
    const id = generateRandomUUIDV4();
    return {
      ...b,
      actualBalanceId,
      hourlyBalanceTAS: {
        hourlyBalanceId: id,
        id: generateRandomUUIDV4(),
        nonWorking: b.hourlyBalanceTAS.nonWorking,
        simple: b.hourlyBalanceTAS.simple,
        working: b.hourlyBalanceTAS.working,
      },
      id,
    };
  });

  const balancesWithCurrentYear: HourlyBalanceTASNotNullable[] = [
    ...newBalances,
    {
      id: balanceId,
      actualBalanceId,
      year,
      hourlyBalanceTAS: {
        simple: calculationsCalculated.simple,
        working: calculationsCalculated.working,
        nonWorking: calculationsCalculated.nonWorking,
        hourlyBalanceId: balanceId,
        id: generateRandomUUIDV4(),
      },
    },
  ];

  const results = subtractHoursFromBalance(
    balancesWithCurrentYear,
    calculationsCalculated.discount
  );

  let total = 0n;
  results.balances.forEach((b) => {
    total += b.hourlyBalanceTAS.simple;
    total += b.hourlyBalanceTAS.working;
    total += b.hourlyBalanceTAS.nonWorking;
  });

  const actualBalance: ActualBalanceDTO = {
    id: actualBalanceId,
    year: year + 1,
    officialId,
    total,
    hourlyBalances: results.balances,
  };

  return {
    ...results,
    actualBalance,
  };
}
