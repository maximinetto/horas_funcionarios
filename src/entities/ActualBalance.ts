import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import Comparable from "utils/Comparator";

import Calculation from "./Calculation";
import Entity from "./Entity";
import HourlyBalance from "./HourlyBalance";
import Official, { TypeOfOfficial } from "./Official";

export default abstract class ActualBalance
  extends Entity
  implements Nullable, Comparable<ActualBalance>
{
  private _id: string;
  private _year: number;
  private _total: Decimal;
  private _official?: Official;
  private _type: TypeOfOfficial;

  public constructor({
    id,
    year,
    total,
    official,
    type,
  }: {
    id: string;
    year: number;
    total?: Decimal;
    official?: Official;
    type: TypeOfOfficial;
  }) {
    super();
    this._id = id;
    this._year = year;
    this._total = total ?? new Decimal(0);
    this._official = official;
    this._type = type;
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public get year(): number {
    return this._year;
  }

  public set year(value: number) {
    this._year = value;
  }

  public get total(): Decimal {
    return this._total;
  }

  public set total(value: Decimal) {
    this._total = value;
  }

  public get official(): Official | undefined {
    return this._official;
  }

  public set official(value: Official | undefined) {
    this._official = value;
  }

  public get type(): TypeOfOfficial {
    return this._type;
  }

  public set type(value: TypeOfOfficial) {
    this._type = value;
  }

  abstract getCalculations(): Calculation[];
  abstract setCalculations(value: Calculation[]): void;
  abstract getHourlyBalances(): HourlyBalance[];
  abstract setHourlyBalances(value: HourlyBalance[]): void;

  isDefault(): boolean {
    return false;
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
}
