import Nullable from "@/entities/null_object/Nullable";
import Comparable from "@/utils/Comparator";
import type Decimal from "decimal.js";
import { Optional } from "typescript-optional";
import type HourlyBalance from "./HourlyBalance";
import Official from "./Official";

export default class ActualBalance
  implements Nullable, Comparable<ActualBalance>
{
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

  isDefault(): boolean {
    return false;
  }

  compareTo(other: ActualBalance): number {
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
