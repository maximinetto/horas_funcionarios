import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalanceTeacher from "./ActualBalanceTeacher";
import HourlyBalance from "./HourlyBalance";

export default class HourlyBalanceTeacher
  extends HourlyBalance
  implements Nullable
{
  balance!: Decimal;
  actualBalance?: ActualBalanceTeacher;

  public constructor({
    id,
    balance,
    year,
    actualBalance,
  }: {
    id?: string;
    year: number;
    balance: Decimal;
    actualBalance?: ActualBalanceTeacher;
  }) {
    super({ id, year });
    this.balance = balance;
    this.actualBalance = actualBalance;
  }

  public isDefault(): boolean {
    return false;
  }

  public calculateTotal(): Decimal {
    return this.balance;
  }
}
