import { Month } from "@prisma/client";
import Calculations from "collections/Calculations";
import Decimal from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import { Optional } from "typescript-optional";
import Comparable from "utils/Comparator";

import { AbstractEntity } from "./AbstractEntity";
import ActualBalance from "./ActualBalance";
import Entity from "./Entity";
import ICalculation from "./ICalculation";

export default class Calculation
  extends AbstractEntity
  implements Entity, Nullable, Comparable<Calculation>, ICalculation
{
  private _id: string;
  private _year: number;
  private _month: Month;
  private _observations?: string;
  private _actualBalance: Optional<ActualBalance>;

  public constructor(
    id: string,
    year: number,
    month: Month,
    observations?: string,
    actualBalance?: ActualBalance
  ) {
    super();
    this._id = id;
    this._year = year;
    this._month = month;
    this._observations = observations;
    this._actualBalance = Optional.ofNullable(actualBalance);
  }
  entityName(): string {
    throw new Error("Method not implemented.");
  }

  public get id(): string {
    return this._id;
  }

  public get year(): number {
    return this._year;
  }

  public get month(): Month {
    return this._month;
  }

  public get observations(): string | undefined {
    return this._observations;
  }

  public get actualBalance(): Optional<ActualBalance> {
    return this._actualBalance;
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
