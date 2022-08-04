import { DecimalType, EntitySchema } from "@mikro-orm/core";
import { Month } from "@prisma/client";
import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalance from "./ActualBalance";
import Calculation from "./Calculation";

export default class CalculationTeacher
  extends Calculation
  implements Nullable
{
  private _surplus: Decimal;
  private _discount: Decimal;

  public constructor({
    discount,
    id,
    month,
    surplus,
    year,
    actualBalance,
    observations,
  }: {
    id: string;
    year: number;
    month: Month;
    surplus: Decimal;
    discount: Decimal;
    observations?: string;
    actualBalance?: ActualBalance;
  }) {
    super({ id, year, month, observations, actualBalance });
    this._surplus = surplus;
    this._discount = discount;
  }

  public get surplus(): Decimal {
    return this._surplus;
  }

  public set surplus(surplus: Decimal) {
    this._surplus = surplus;
  }

  public get discount(): Decimal {
    return this._discount;
  }

  public set discount(discount: Decimal) {
    this._discount = discount;
  }

  public isDefault(): boolean {
    return false;
  }
}

export const schema = new EntitySchema<CalculationTeacher, Calculation>({
  name: "ActualBalance",
  tableName: "actual_balances",
  extends: "Entity",
  properties: {
    surplus: {
      type: DecimalType,
    },
    discount: {
      type: DecimalType,
      fieldName: "discount",
    },
  },
});
