import { DecimalType, EntitySchema } from "@mikro-orm/core";
import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalance from "./ActualBalance";
import HourlyBalance from "./HourlyBalance";

export default class HourlyBalanceTeacher
  extends HourlyBalance
  implements Nullable
{
  private _balance: Decimal;

  public constructor(
    id: string,
    year: number,
    balance: Decimal,
    actualBalance?: ActualBalance
  ) {
    super({ id, year, actualBalance });
    this._balance = balance;
  }

  public get balance(): Decimal {
    return this._balance;
  }

  public set balance(value: Decimal) {
    this._balance = value;
  }

  public isDefault(): boolean {
    return false;
  }

  public calculateTotal(): Decimal {
    throw new Error("Method not implemented.");
  }
}

export const schema = new EntitySchema<HourlyBalanceTeacher, HourlyBalance>({
  name: "ActualBalance",
  tableName: "actual_balances",
  extends: "Entity",
  properties: {
    balance: {
      type: DecimalType,
      fieldName: "surplus_non_working",
    },
  },
});
