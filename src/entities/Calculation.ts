import { Month } from "@prisma/client";
import Calculations from "collections/Calculations";
import Decimal from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import Comparable from "utils/Comparator";

import ActualBalance from "./ActualBalance";
import Entity from "./Entity";
import ICalculation from "./interfaces/ICalculation";

export default abstract class Calculation
  extends Entity
  implements Nullable, Comparable<Calculation>, ICalculation
{
  id!: string;
  year!: number;
  month!: Month;
  observations?: string;

  public constructor({
    id,
    month,
    year,
    observations,
  }: {
    id: string;
    year: number;
    month: Month;
    observations?: string;
  }) {
    super();
    this.id = id;
    this.year = year;
    this.month = month;
    this.observations = observations;
  }

  public isDefault(): boolean {
    return false;
  }

  public getTotalHoursPerCalculation(): Decimal {
    return new Decimal(0);
  }

  public discountPerCalculation(): Decimal {
    return new Decimal(0);
  }

  public static calculationsHasMoreLaterHours(
    calculations: Calculation[] | Calculations<Calculation>
  ) {
    if (calculations instanceof Calculations) {
      return !calculations.isEmpty();
    }
    return calculations.length > 0;
  }

  abstract getActualBalance(): ActualBalance | undefined;
  abstract setActualBalance(actualBalance: ActualBalance);

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
