import type Decimal from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import Comparable from "utils/Comparator";

import Entity from "./Entity";

export default abstract class HourlyBalance
  extends Entity
  implements Nullable, Comparable<HourlyBalance>
{
  private _id: string;
  private _year: number;

  public constructor({ id, year }: { id: string; year: number }) {
    super();
    this._id = id;
    this._year = year;
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get year(): number {
    return this._year;
  }

  public set year(value: number) {
    this._year = value;
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
