import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import { TypeOfOfficial } from "enums/officials";
import Comparable from "utils/Comparator";

import Calculation from "./Calculation";
import Entity from "./Entity";
import HourlyBalance from "./HourlyBalance";
import Official from "./Official";

export default abstract class ActualBalance
  extends Entity
  implements Nullable, Comparable<ActualBalance>
{
  id!: string;
  year!: number;
  total!: Decimal;
  type!: TypeOfOfficial;
  official?: Official;

  public constructor({
    id,
    year,
    total,
    official,
    type,
  }: {
    id?: string;
    year: number;
    total?: Decimal;
    official?: Official;
    type: TypeOfOfficial;
  }) {
    super();
    if (id) this.id = id;
    this.year = year;
    this.total = total ?? new Decimal(0);
    this.official = official;
    this.type = type;
  }

  abstract getCalculations(): Calculation[];
  abstract setCalculations(value: Calculation[]): void;
  abstract getHourlyBalances(): HourlyBalance[];
  abstract setHourlyBalances(value: HourlyBalance[]): void;
  abstract addHourlyBalance(...items: HourlyBalance[]);
  abstract removeHourlyBalance(...items: HourlyBalance[]);

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
