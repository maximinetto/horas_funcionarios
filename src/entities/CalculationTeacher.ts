import Nullable from "@/entities/null_object/Nullable";
import { Month } from "@prisma/client";
import { Decimal } from "decimal.js";
import Calculation from "./Calculation";

export default class CalculationTeacher
  extends Calculation
  implements Nullable
{
  surplus: Decimal;
  discount: Decimal;
  calculationId: string;

  public constructor(
    id: string,
    year: number,
    month: Month,
    surplus: Decimal,
    discount: Decimal,
    calculationId: string,
    observations?: string,
    actualBalance?: any
  ) {
    super(id, year, month, observations, actualBalance);
    this.surplus = surplus;
    this.discount = discount;
    this.calculationId = calculationId;
  }

  public getSurplus(): Decimal {
    return this.surplus;
  }

  public getDiscount(): Decimal {
    return this.discount;
  }

  public getCalculationId(): string {
    return this.calculationId;
  }

  public isDefault(): boolean {
    return false;
  }
}
