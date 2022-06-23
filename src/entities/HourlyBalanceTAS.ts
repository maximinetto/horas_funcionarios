import { Decimal } from "decimal.js";

import Nullable from "@/entities/null_object/Nullable";

import type ActualBalance from "./ActualBalance";
import HourlyBalance from "./HourlyBalance";

export default class HourlyBalanceTAS
  extends HourlyBalance
  implements Nullable
{
  private _working: Decimal;
  private _nonWorking: Decimal;
  private _simple: Decimal;
  private _hourlyBalanceId: string;

  public constructor(
    id: string,
    year: number,
    working: Decimal,
    nonWorking: Decimal,
    simple: Decimal,
    hourlyBalanceId: string,
    actualBalance?: ActualBalance
  ) {
    super(id, year, actualBalance);
    this._working = working;
    this._nonWorking = nonWorking;
    this._simple = simple;
    this._hourlyBalanceId = hourlyBalanceId;
  }

  public get working(): Decimal {
    return this._working;
  }

  public get nonWorking(): Decimal {
    return this._nonWorking;
  }

  public get simple(): Decimal {
    return this._simple;
  }

  public get hourlyBalanceId(): string {
    return this._hourlyBalanceId;
  }

  public isDefault(): boolean {
    return false;
  }

  public calculateTotal(): Decimal {
    return this.working.plus(this.nonWorking).plus(this.simple);
  }
}
