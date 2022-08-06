import { DecimalType, EntitySchema } from "@mikro-orm/core";
import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalance from "./ActualBalance";
import HourlyBalance from "./HourlyBalance";

export default class HourlyBalanceTAS
  extends HourlyBalance
  implements Nullable
{
  private _working: Decimal;
  private _nonWorking: Decimal;
  private _simple: Decimal;

  public constructor(
    id: string,
    year: number,
    working: Decimal,
    nonWorking: Decimal,
    simple: Decimal,
    actualBalance?: ActualBalance
  ) {
    super({ id, year, actualBalance });
    this._working = working;
    this._nonWorking = nonWorking;
    this._simple = simple;
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

  public isDefault(): boolean {
    return false;
  }

  public calculateTotal(): Decimal {
    return this.working.plus(this.nonWorking).plus(this.simple);
  }
}

export const schema = new EntitySchema<HourlyBalanceTAS, HourlyBalance>({
  name: "HourlyBalanceTAS",
  tableName: "hourly_balances_tas",
  extends: "Entity",
  properties: {
    nonWorking: {
      type: DecimalType,
      fieldName: "surplus_non_working",
    },
    simple: {
      type: DecimalType,
      fieldName: "surplus_simple",
    },
    working: {
      type: DecimalType,
      fieldName: "surplus_business",
    },
  },
});
