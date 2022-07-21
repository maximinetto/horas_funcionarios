import { Decimal } from "decimal.js";
import { Optional } from "typescript-optional";

import { ActualBalanceWithHourlyBalancesSimple } from "@/@types/actualBalance";
import Nullable from "@/entities/null_object/Nullable";
import Comparable from "@/utils/Comparator";
import { generateRandomUUIDV4 } from "@/utils/strings";

import Calculation from "./Calculation";
import type HourlyBalance from "./HourlyBalance";
import Official from "./Official";

export default class ActualBalance
  implements
    Nullable,
    Comparable<ActualBalance>,
    ActualBalanceWithHourlyBalancesSimple
{
  private _id: string;
  private _year: number;
  private _total: Decimal;
  private _official: Optional<Official>;
  private _hourlyBalances: HourlyBalance[];
  private _calculations: Calculation[];

  public constructor(
    id: string,
    year: number,
    total?: Decimal,
    official?: Official,
    hourlyBalances?: HourlyBalance[],
    calculations?: Calculation[]
  ) {
    this._id = id;
    this._year = year;
    this._total = total ?? new Decimal(0);
    this._official = Optional.ofNullable(official);
    this._hourlyBalances = hourlyBalances ?? [];
    this._calculations = calculations ?? [];
  }

  public get id(): string {
    return this._id;
  }

  public get year(): number {
    return this._year;
  }

  public get total(): Decimal {
    return this._total;
  }

  public get official(): Optional<Official> {
    return this._official;
  }

  public get hourlyBalances(): HourlyBalance[] {
    return this._hourlyBalances;
  }

  public set hourlyBalances(hourlyBalances: HourlyBalance[]) {
    this._hourlyBalances = hourlyBalances;
  }

  public get calculations(): Calculation[] {
    return this._calculations;
  }

  public set calculations(calculations: Calculation[]) {
    this._calculations = calculations;
  }

  isDefault(): boolean {
    return false;
  }

  static default(id = generateRandomUUIDV4()): ActualBalance {
    return new ActualBalance(id, 0);
  }

  compareTo(other: ActualBalance): number {
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
      hourlyBalances: this.hourlyBalances.map((h) => h.toJSON()),
      id: this.id,
      official: this.official,
      total: this.total.toString(),
      year: this.year,
    };
  }
}
