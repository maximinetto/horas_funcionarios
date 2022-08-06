import { EntitySchema } from "@mikro-orm/core";
import { Month } from "@prisma/client";
import Calculations from "collections/Calculations";
import Decimal from "decimal.js";
import Nullable from "entities/null_object/Nullable";
import Comparable from "utils/Comparator";

import ActualBalance from "./ActualBalance";
import Entity from "./Entity";
import ICalculation from "./ICalculation";

export default abstract class Calculation
  extends Entity
  implements Nullable, Comparable<Calculation>, ICalculation
{
  private _id: string;
  private _year: number;
  private _month: Month;
  private _observations?: string;
  private _actualBalance?: ActualBalance;

  public constructor({
    id,
    month,
    year,
    observations,
    actualBalance,
  }: {
    id: string;
    year: number;
    month: Month;
    observations?: string;
    actualBalance?: ActualBalance;
  }) {
    super();
    this._id = id;
    this._year = year;
    this._month = month;
    this._observations = observations;
    this._actualBalance = actualBalance;
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public get year(): number {
    return this._year;
  }

  public set year(value: number) {
    this._year = value;
  }

  public get month(): Month {
    return this._month;
  }

  public set month(value: Month) {
    this._month = value;
  }

  public get observations(): string | undefined {
    return this._observations;
  }

  public set observations(value: string | undefined) {
    this._observations = value;
  }

  public get actualBalance(): ActualBalance | undefined {
    return this._actualBalance;
  }

  public set actualBalance(actualBalance: ActualBalance | undefined) {
    this._actualBalance = actualBalance;
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

export const schema = new EntitySchema<Calculation, Entity>({
  name: "Calculation",
  extends: "Entity",
  abstract: true,
  properties: {
    id: {
      type: "uuid",
      primary: true,
    },
    year: {
      type: "int",
    },
    month: {
      type: "int",
    },
    observations: {
      type: "text",
      nullable: true,
    },
    actualBalance: {
      reference: "m:1",
      entity: () => ActualBalance,
      inversedBy: "calculations",
    },
  },
});
