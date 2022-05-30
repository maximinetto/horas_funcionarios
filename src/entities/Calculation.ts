import Nullable from "@/entities/null_object/Nullable";
import Comparable from "@/utils/Comparator";
import { Month } from "@prisma/client";
import { Optional } from "typescript-optional";
import ActualBalance from "./ActualBalance";

export default class Calculation implements Nullable, Comparable<Calculation> {
  private _id: string;
  private _year: number;
  private _month: Month;
  private _observations?: string;
  private _actualBalance: Optional<ActualBalance>;

  public constructor(
    id: string,
    year: number,
    month: Month,
    observations?: string,
    actualBalance?: ActualBalance
  ) {
    this._id = id;
    this._year = year;
    this._month = month;
    this._observations = observations;
    this._actualBalance = Optional.ofNullable(actualBalance);
  }

  public get id(): string {
    return this._id;
  }

  public get year(): number {
    return this._year;
  }

  public get month(): Month {
    return this._month;
  }

  public get observations(): string | undefined {
    return this._observations;
  }

  public get actualBalance(): Optional<ActualBalance> {
    return this._actualBalance;
  }

  public isDefault(): boolean {
    return false;
  }

  compareTo(other: Calculation): number {
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
}
