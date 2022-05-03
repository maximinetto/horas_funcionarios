import { ActualBalanceRepository } from "@/persistence/actualBalance";
import { HourlyBalance, HourlyBalanceTAS } from "@prisma/client";

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

  const result = lastActualBalances.map((ac) => ({
    ...ac,
    hourlyBalances: ac.hourlyBalances?.filter((h) => {
      const min = getMinHourlyBalanceWithSumGreaterThanZero(ac.hourlyBalances);
      return min ? h.year >= min.year : false;
    }),
  }));

  return result;
}

export function getCurrentActualHourlyBalance(
  actualHourlyBalances: {
    hourlyBalances: (HourlyBalance & {
      hourlyBalanceTAS: HourlyBalanceTAS | null;
    })[];
    id: string;
    year: number;
    total: bigint;
    officialId: number;
  }[],
  year: number
) {
  return actualHourlyBalances.find((a) => a.year === year);
}

function getMinHourlyBalanceWithSumGreaterThanZero(
  hourlyBalances: (HourlyBalance & {
    hourlyBalanceTAS: HourlyBalanceTAS | null;
  })[]
) {
  const results = hourlyBalances.slice().sort((a, b) => a.year - b.year);

  for (const hourlyBalance of results) {
    if (hourlyBalance.hourlyBalanceTAS == null) {
      throw new Error("Hourly Balances must be defined");
    }
    const { simple, working, nonWorking } = hourlyBalance.hourlyBalanceTAS;

    if (simple + working + nonWorking > 0) {
      return hourlyBalance;
    }
  }
}
