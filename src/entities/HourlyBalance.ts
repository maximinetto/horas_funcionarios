import type Decimal from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import Comparable from "utils/Comparator";

import Entity from "./Entity";

export default abstract class HourlyBalance
  extends Entity
  implements Nullable, Comparable<HourlyBalance>
{
  id!: string;
  year!: number;

  public constructor({ id, year }: { id?: string; year: number }) {
    super();
    if (id) this.id = id;
    this.year = year;
  }

  public isDefault(): boolean {
    return false;
  }

  public abstract calculateTotal(): Decimal;

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

  toJSON() {
    return {
      id: this.id,
      year: this.year,
    };
  }
}
