import type Decimal from "decimal.js";
import type ActualBalance from "./ActualBalance";
import HourlyBalance from "./HourlyBalance";

export default class HourlyBalanceTeacher extends HourlyBalance {
  private balance: Decimal;
  private hourlyBalanceId: string;

  public constructor(
    id: string,
    year: number,
    balance: Decimal,
    hourlyBalanceId: string,
    actualBalance?: ActualBalance
  ) {
    super(id, year, actualBalance);
    this.balance = balance;
    this.hourlyBalanceId = hourlyBalanceId;
  }

  public getBalance(): Decimal {
    return this.balance;
  }

  public getHourlyBalanceId(): string {
    return this.hourlyBalanceId;
  }
}
