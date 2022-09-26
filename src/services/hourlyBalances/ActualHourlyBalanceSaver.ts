import ActualBalance from "../../entities/ActualBalance";
import ActualHourlyBalanceRepository from "../../persistence/ActualBalance/ActualHourlyBalanceRepository";
import Database from "../../persistence/context/Database";
import DatabaseFactory from "../../persistence/context/index.config";
import { generateRandomUUIDV4 } from "../../utils/strings";

export default class ActualHourlyBalanceSaver {
  private _actualHourlyBalanceRepository: ActualHourlyBalanceRepository;
  private _database: Database;

  constructor({
    actualHourlyBalanceRepository,
    database,
  }: {
    actualHourlyBalanceRepository: ActualHourlyBalanceRepository;
    database: Database;
  }) {
    this._actualHourlyBalanceRepository = actualHourlyBalanceRepository;
    this._database = database;
  }

  async save(actualBalances: ActualBalance[]) {
    const [first, ...others] = actualBalances;
    await this.saveInPersistance(first);
    if (others.length > 0) {
      await this.queue(others);
    }

    await DatabaseFactory.getInstance().commit();
  }

  private saveInPersistance(actualBalance: ActualBalance) {
    // console.log("actualBalance to save:", actualBalance);

    actualBalance.getCalculations().forEach((c) => {
      if (c.id == null) c.id = generateRandomUUIDV4();
      c.setActualBalance(actualBalance);
    });

    return this._actualHourlyBalanceRepository.set(actualBalance);
  }

  private async queue(actualBalances: ActualBalance[]) {
    // console.log("actualBalances to queue:", actualBalances);
  }
}
