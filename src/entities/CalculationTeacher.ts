import { Month } from "@prisma/client";
import { Decimal } from "decimal.js";
import Nullable from "entities/null_object/Nullable";

import ActualBalance from "./ActualBalance";
import ActualBalanceTeacher from "./ActualBalanceTeacher";
import Calculation from "./Calculation";
import Entity from "./Entity";

interface CalculationTeacherModel extends Entity {
  id: string;
  year: number;
  month: Month;
  surplus: Decimal;
  discount: Decimal;
  observations?: string;
  actualBalance?: ActualBalanceTeacher;
}
export default class CalculationTeacher
  extends Calculation
  implements Nullable
{
  surplus!: Decimal;
  discount!: Decimal;
  actualBalance?: ActualBalanceTeacher;

  public constructor({
    discount,
    id,
    month,
    surplus,
    year,
    actualBalance,
    observations,
    createdAt,
    updatedAt,
  }: CalculationTeacherModel) {
    super({ id, year, month, observations });
    this.surplus = surplus;
    this.discount = discount;
    this.actualBalance = actualBalance;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getTotalHoursPerCalculation(): Decimal {
    return this.surplus;
  }

  public discountPerCalculation(): Decimal {
    return this.discount;
  }

  getActualBalance(): ActualBalance | undefined {
    return this.actualBalance;
  }
  setActualBalance(actualBalance: ActualBalanceTeacher) {
    this.actualBalance = actualBalance;
  }
}
