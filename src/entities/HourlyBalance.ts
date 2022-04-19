import Nullable from "@/entities/null_object/Nullable";
import Comparable from "@/utils/Comparator";
import { Optional } from "typescript-optional";
import type ActualBalance from "./ActualBalance";

export default abstract class HourlyBalance
  implements Nullable, Comparable<HourlyBalance>
{
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

  public isDefault(): boolean {
    return false;
  }

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
}
