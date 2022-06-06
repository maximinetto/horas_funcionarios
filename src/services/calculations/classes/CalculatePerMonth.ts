import type Decimal from "decimal.js";

export interface CalculatePerMonthBase {
  totalBalance: Decimal;
  totalDiscount: Decimal;
}

export interface CalculatePerMonthAlternative {}

export default interface CalculatePerMonth
  extends CalculatePerMonthBase,
    CalculatePerMonthAlternative {}
