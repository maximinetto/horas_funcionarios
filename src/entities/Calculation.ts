import Nullable from "@/entities/null_object/Nullable";
import Comparable from "@/utils/Comparator";
import { Month } from "@prisma/client";
import { Optional } from "typescript-optional";
import ActualBalance from "./ActualBalance";

export default abstract class Calculation
  implements Nullable, Comparable<Calculation>
{
  private id: string;
  private year: number;
  private month: Month;
  private observations?: string;
  private actualBalance: Optional<ActualBalance>;

  public constructor(
    id: string,
    year: number,
    month: Month,
    observations?: string,
    actualBalance?: ActualBalance
  ) {
    this.id = id;
    this.year = year;
    this.month = month;
    this.observations = observations;
    this.actualBalance = Optional.ofNullable(actualBalance);
  }

  public getId(): string {
    return this.id;
  }

  public getYear(): number {
    return this.year;
  }

  public getMonth(): Month {
    return this.month;
  }

  public getObservations(): string | undefined {
    return this.observations;
  }

  public getActualBalance(): Optional<ActualBalance> {
    return this.actualBalance;
  }

  public isDefault(): boolean {
    return false;
  }

  compareTo(other: Calculation): number {
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
