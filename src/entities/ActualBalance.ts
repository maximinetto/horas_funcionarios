import { Collection, DecimalType, EntitySchema } from "@mikro-orm/core";
import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import Comparable from "utils/Comparator";

import Calculation from "./Calculation";
import Entity from "./Entity";
import HourlyBalance from "./HourlyBalance";
import Official from "./Official";

export default class ActualBalance
  extends Entity
  implements Nullable, Comparable<ActualBalance>
{
  private _id: string;
  private _year: number;
  private _total: Decimal;
  private _official?: Official;
  private _calculations = new Collection<Calculation>(this);
  private _hourlyBalances = new Collection<HourlyBalance>(this);

  public constructor({
    id,
    year,
    total,
    official,
    calculations,
    hourlyBalances,
  }: {
    id: string;
    year: number;
    total?: Decimal;
    official?: Official;
    calculations?: Calculation[];
    hourlyBalances?: HourlyBalance[];
  }) {
    super();
    this._id = id;
    this._year = year;
    this._total = total ?? new Decimal(0);
    this._official = official;
    this._calculations = new Collection<Calculation>(this, calculations);
    this._hourlyBalances = new Collection<HourlyBalance>(this, hourlyBalances);
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

  public get calculations(): Collection<Calculation> {
    return this._calculations;
  }

  public set calculations(value: Collection<Calculation>) {
    this._calculations = value;
  }

  public get hourlyBalances(): Collection<HourlyBalance> {
    return this._hourlyBalances;
  }

  public set hourlyBalances(value: Collection<HourlyBalance>) {
    this._hourlyBalances = value;
  }

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

export const schema = new EntitySchema<ActualBalance, Entity>({
  name: "ActualBalance",
  tableName: "actual_balances",
  extends: "Entity",
  properties: {
    id: {
      type: "uuid",
      primary: true,
    },
    year: {
      type: "int",
    },
    total: {
      type: DecimalType,
    },
    official: {
      reference: "m:1",
      entity: () => Official,
      inversedBy: "actualBalances",
    },
    calculations: {
      reference: "1:m",
      entity: () => Calculation,
      mappedBy: "actualBalance",
    },
    hourlyBalances: {
      reference: "1:m",
      entity: () => HourlyBalance,
      mappedBy: "actualBalance",
    },
  },
});
