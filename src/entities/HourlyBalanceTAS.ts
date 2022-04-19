import type Decimal from "decimal.js";
import type ActualBalance from "./ActualBalance";
import HourlyBalance from "./HourlyBalance";

export default class HourlyBalanceTAS extends HourlyBalance {
  private working: Decimal;
  private nonWorking: Decimal;
  private simple: Decimal;
  private hourlyBalanceId: string;

  public constructor(
    id: string,
    year: number,
    working: Decimal,
    nonWorking: Decimal,
    simple: Decimal,
    hourlyBalanceId: string,
    actualBalance?: ActualBalance
  ) {
    super(id, year, actualBalance);
    this.working = working;
    this.nonWorking = nonWorking;
    this.simple = simple;
    this.hourlyBalanceId = hourlyBalanceId;
  }

  public getWorking(): Decimal {
    return this.working;
  }

  public getNonWorking(): Decimal {
    return this.nonWorking;
  }

  public getSimple(): Decimal {
    return this.simple;
  }

  public getHourlyBalanceId(): string {
    return this.hourlyBalanceId;
  }
}
