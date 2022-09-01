import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalanceTAS from "./ActualBalanceTAS";
import HourlyBalance from "./HourlyBalance";

export default class HourlyBalanceTAS
  extends HourlyBalance
  implements Nullable
{
  working!: Decimal;
  nonWorking!: Decimal;
  simple!: Decimal;
  actualBalance?: ActualBalanceTAS;

  public constructor({
    id,
    working,
    nonWorking,
    simple,
    year,
    actualBalance,
  }: {
    id: string;
    year: number;
    working: Decimal;
    nonWorking: Decimal;
    simple: Decimal;
    actualBalance?: ActualBalanceTAS;
  }) {
    super({ id, year });
    this.working = working;
    this.nonWorking = nonWorking;
    this.simple = simple;
    this.actualBalance = actualBalance;
  }

  public isDefault(): boolean {
    return false;
  }

  public calculateTotal(): Decimal {
    return this.working.plus(this.nonWorking).plus(this.simple);
  }
}
