import type Decimal from "decimal.js";
import { Optional } from "typescript-optional";
import type HourlyBalance from "./HourlyBalance";
import Official from "./Official";

export default class ActualBalance {
  private id: string;
  private year: number;
  private total: Decimal;
  private official: Optional<Official>;
  private hourlyBalances: HourlyBalance[];

  public constructor(
    id: string,
    year: number,
    total: Decimal,
    official?: Official,
    hourlyBalances?: HourlyBalance[]
  ) {
    this.id = id;
    this.year = year;
    this.total = total;
    this.official = Optional.ofNullable(official);
    this.hourlyBalances = hourlyBalances ?? [];
  }

  public getId(): string {
    return this.id;
  }

  public getYear(): number {
    return this.year;
  }

  public getTotal(): Decimal {
    return this.total;
  }

  public getOfficial(): Optional<Official> {
    return this.official;
  }

  public getHourlyBalances(): HourlyBalance[] {
    return this.hourlyBalances;
  }
}
