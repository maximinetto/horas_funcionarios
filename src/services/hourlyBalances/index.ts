import ActualBalance from "@/entities/ActualBalance";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
import { ActualBalanceRepository } from "@/persistence/actualBalance";

export async function balances({
  year,
  officialId,
  actualBalanceRepository,
}: {
  year: number;
  officialId: number;
  actualBalanceRepository: ActualBalanceRepository;
}) {
  const lastActualBalances = await actualBalanceRepository.getTAS(
    {
      year: {
        gte: year,
      },
      officialId,
    },
    {
      include: {
        hourlyBalances: {
          include: {
            hourlyBalanceTAS: true,
          },
        },
      },
    }
  );

  const result = lastActualBalances.map((ac) => {
    const min = getMinHourlyBalanceWithSumGreaterThanZero(ac.hourlyBalances);
    const remainingHourlyBalances = ac.hourlyBalances?.filter((h) => {
      return min ? h.year >= min.year : false;
    });
    return new ActualBalance(
      ac.id,
      ac.year,
      ac.total,
      ac.official.orUndefined(),
      remainingHourlyBalances
    );
  });

  return result;
}

export function getCurrentActualHourlyBalance(
  actualHourlyBalances: ActualBalance[],
  year: number
) {
  return actualHourlyBalances.find((a) => a.year === year);
}

function getMinHourlyBalanceWithSumGreaterThanZero(
  hourlyBalances: HourlyBalanceTAS[]
) {
  const results = hourlyBalances.slice().sort((a, b) => a.year - b.year);

  for (const hourlyBalance of results) {
    const { simple, working, nonWorking } = hourlyBalance;

    if (
      simple.plus(working.toString()).plus(nonWorking.toString()).greaterThan(0)
    ) {
      return hourlyBalance;
    }
  }
}
