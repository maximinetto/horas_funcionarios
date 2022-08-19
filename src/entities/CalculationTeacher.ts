import { Month } from "@prisma/client";
import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalanceTeacher from "./ActualBalanceTeacher";
import Calculation from "./Calculation";

export default class CalculationTeacher
  extends Calculation
  implements Nullable
{
  private _surplus: Decimal;
  private _discount: Decimal;
  private _actualBalance?: ActualBalanceTeacher;

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
    actualBalance?: ActualBalanceTeacher;
  }) {
    super({ id, year, month, observations });
    this._surplus = surplus;
    this._discount = discount;
    this._actualBalance = actualBalance;
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

  public get actualBalance(): ActualBalanceTeacher | undefined {
    return this._actualBalance;
  }

  public set actualBalance(actualBalance: ActualBalanceTeacher | undefined) {
    this._actualBalance = actualBalance;
  }
}
