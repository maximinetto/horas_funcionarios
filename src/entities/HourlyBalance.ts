import type Decimal from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import { HourlyBalanceSimple } from "types/hourlyBalance";
import { Optional } from "typescript-optional";
import Comparable from "utils/Comparator";

import type ActualBalance from "./ActualBalance";
import Entity from "./Entity";

export default abstract class HourlyBalance
  implements Entity, Nullable, Comparable<HourlyBalance>, HourlyBalanceSimple
{
  private _id: string;
  private _year: number;
  private _actualBalance: Optional<ActualBalance>;

  public constructor(id: string, year: number, actualBalance?: ActualBalance) {
    this._id = id;
    this._year = year;
    this._actualBalance = Optional.ofNullable(actualBalance);
  }

  public get id(): string {
    return this._id;
  }

  public get year(): number {
    return this._year;
  }

  public get actualBalance(): Optional<ActualBalance> {
    return this._actualBalance;
  }

  public set actualBalance(actualBalance: Optional<ActualBalance>) {
    this._actualBalance = actualBalance;
  }

  public isDefault(): boolean {
    return false;
  }

  public abstract calculateTotal(): Decimal;

  compareTo(other: HourlyBalance): number {
    if (this.id === other.id) {
      return 0;
    }
    if (this.id === null) {
      return -1;
    }
    if (other.id === null) {
      return 1;
    }

    return this.id.localeCompare(other.id);
  }

  toJSON() {
    return {
      id: this.id,
      year: this.year,
    };
  }
}
