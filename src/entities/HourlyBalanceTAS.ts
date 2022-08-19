import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalanceTAS from "./ActualBalanceTAS";
import HourlyBalance from "./HourlyBalance";

export default class HourlyBalanceTAS
  extends HourlyBalance
  implements Nullable
{
  private _working: Decimal;
  private _nonWorking: Decimal;
  private _simple: Decimal;
  private _actualBalance?: ActualBalanceTAS;

  public constructor({
    id,
    working,
    nonWorking,
    simple,
    year,
    actualBalance,
  }: {
    id: string;
    year: number;
    working: Decimal;
    nonWorking: Decimal;
    simple: Decimal;
    actualBalance?: ActualBalanceTAS;
  }) {
    super({ id, year });
    this._working = working;
    this._nonWorking = nonWorking;
    this._simple = simple;
    this._actualBalance = actualBalance;
  }

  public get working(): Decimal {
    return this._working;
  }

  public set working(value: Decimal) {
    this._working = value;
  }

  public get nonWorking(): Decimal {
    return this._nonWorking;
  }

  public set nonWorking(value: Decimal) {
    this._nonWorking = value;
  }

  public get simple(): Decimal {
    return this._simple;
  }

  public set simple(value: Decimal) {
    this._simple = value;
  }

  public get actualBalance(): ActualBalanceTAS | undefined {
    return this._actualBalance;
  }

  public set actualBalance(value: ActualBalanceTAS | undefined) {
    this._actualBalance = value;
  }

  public isDefault(): boolean {
    return false;
  }

  public calculateTotal(): Decimal {
    return this.working.plus(this.nonWorking).plus(this.simple);
  }
}
