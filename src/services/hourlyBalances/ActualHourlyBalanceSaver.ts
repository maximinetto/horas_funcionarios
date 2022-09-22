import ActualBalance from "entities/ActualBalance";
import ActualHourlyBalanceRepository from "persistence/ActualBalance/ActualHourlyBalanceRepository";
import { generateRandomUUIDV4 } from "utils/strings";

export default class ActualHourlyBalanceSaver {
  private _actualHourlyBalanceRepository: ActualHourlyBalanceRepository;

  constructor({
    actualHourlyBalanceRepository,
  }: {
    actualHourlyBalanceRepository: ActualHourlyBalanceRepository;
  }) {
    this._actualHourlyBalanceRepository = actualHourlyBalanceRepository;
  }

  save(actualBalances: ActualBalance[]) {
    const [first, ...others] = actualBalances;
    this.saveInPersistance(first);
    if (others.length > 0) {
      this.queue(others);
    }
  }

  private saveInPersistance(actualBalance: ActualBalance) {
    // console.log("actualBalance to save:", actualBalance);

    actualBalance.getCalculations().forEach((c) => {
      c.id = generateRandomUUIDV4();
      c.setActualBalance(actualBalance);
    });

    this._actualHourlyBalanceRepository.set(actualBalance);
  }

  private queue(actualBalances: ActualBalance[]) {
    // console.log("actualBalances to queue:", actualBalances);
  }
}
