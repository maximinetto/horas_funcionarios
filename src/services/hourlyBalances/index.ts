import ActualBalance from "entities/ActualBalance";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import ActualHourlyBalanceRepository from "persistence/ActualBalance/ActualHourlyBalanceRepository";

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
    const lastActualBalances =
      await this.actualHourlyBalanceRepository.getTASWithYearGreaterThanActual({
        officialId,
        year,
      });

    console.log("lastActualBalances:", lastActualBalances);

    return lastActualBalances.map((ac) => {
      const hourlyBalances = ac.getHourlyBalances() as HourlyBalanceTAS[];

      const min = getMinHourlyBalanceWithSumGreaterThanZero(hourlyBalances);
      const remainingHourlyBalances = hourlyBalances.filter((h) => {
        return min ? h.year >= min.year : false;
      });
      return new ActualBalanceTAS({
        id: ac.id,
        year: ac.year,
        total: ac.total,
        official: ac.official,
        hourlyBalances: remainingHourlyBalances,
      });
    });
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
