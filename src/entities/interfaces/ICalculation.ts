import type Decimal from "decimal.js";

export default interface ICalculation {
  getTotalHoursPerCalculation(): Decimal;
  discountPerCalculation(): Decimal;
}
