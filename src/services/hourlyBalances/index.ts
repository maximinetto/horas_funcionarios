import ActualBalance from "entities/ActualBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import { ActualHourlyBalanceRepository } from "persistence/actualBalance";

export default class Balances {
  private actualHourlyBalanceRepository: ActualHourlyBalanceRepository;

  constructor({
    actualHourlyBalanceRepository,
  }: {
    actualHourlyBalanceRepository: ActualHourlyBalanceRepository;
  }) {
    this.actualHourlyBalanceRepository = actualHourlyBalanceRepository;
  }

  async calculate({ year, officialId }: { year: number; officialId: number }) {
    const lastActualBalances = await this.actualHourlyBalanceRepository.getTAS(
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
}

// TODO. Cambiar métodos por la clase ActualBalance o Array
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
