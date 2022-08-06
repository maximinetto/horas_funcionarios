import { EntitySchema } from "@mikro-orm/core";
import type Decimal from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import Comparable from "utils/Comparator";

import ActualBalance from "./ActualBalance";
import Entity from "./Entity";

export default abstract class HourlyBalance
  extends Entity
  implements Nullable, Comparable<HourlyBalance>
{
  private _id: string;
  private _year: number;
  private _actualBalance?: ActualBalance;

  public constructor({
    id,
    year,
    actualBalance,
  }: {
    id: string;
    year: number;
    actualBalance?: ActualBalance;
  }) {
    super();
    this._id = id;
    this._year = year;
    this._actualBalance = actualBalance;
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

  public get actualBalance(): ActualBalance | undefined {
    return this._actualBalance;
  }

  public set actualBalance(value: ActualBalance | undefined) {
    this._actualBalance = value;
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

export const schema = new EntitySchema<HourlyBalance, Entity>({
  name: "HourlyBalance",
  tableName: "hourly_balances",
  extends: "Entity",
  abstract: true,
  properties: {
    id: {
      type: "uuid",
      primary: true,
    },
    year: {
      type: "int",
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalance,
      inversedBy: "hourlyBalances",
    },
  },
});
