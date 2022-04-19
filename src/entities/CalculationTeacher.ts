import { Month } from "@prisma/client";
import type Decimal from "decimal.js";
import Calculation from "./Calculation";

export default class CalculationTeacher extends Calculation {
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
}
