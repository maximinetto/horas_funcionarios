import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalanceTeacher from "./ActualBalanceTeacher";
import HourlyBalance from "./HourlyBalance";

export default class HourlyBalanceTeacher
  extends HourlyBalance
  implements Nullable
{
  private _balance: Decimal;
  private _actualBalance?: ActualBalanceTeacher;

  public constructor({
    id,
    balance,
    year,
    actualBalance,
  }: {
    id: string;
    year: number;
    balance: Decimal;
    actualBalance?: ActualBalanceTeacher;
  }) {
    super({ id, year });
    this._balance = balance;
    this._actualBalance = actualBalance;
  }

  public get balance(): Decimal {
    return this._balance;
  }

  public set balance(value: Decimal) {
    this._balance = value;
  }

  public get actualBalance(): ActualBalanceTeacher | undefined {
    return this._actualBalance;
  }

  public set actualBalance(value: ActualBalanceTeacher | undefined) {
    this._actualBalance = value;
  }

  public isDefault(): boolean {
    return false;
  }

  public calculateTotal(): Decimal {
    throw new Error("Method not implemented.");
  }
}
