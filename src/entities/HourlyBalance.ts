import { Optional } from "typescript-optional";
import type ActualBalance from "./ActualBalance";

export default abstract class HourlyBalance {
  private id: string;
  private year: number;
  private actualBalance: Optional<ActualBalance>;

  public constructor(id: string, year: number, actualBalance?: ActualBalance) {
    this.id = id;
    this.year = year;
    this.actualBalance = Optional.ofNullable(actualBalance);
  }

  public getId(): string {
    return this.id;
  }

  public getYear(): number {
    return this.year;
  }

  public getActualBalance(): Optional<ActualBalance> {
    return this.actualBalance;
  }
}
