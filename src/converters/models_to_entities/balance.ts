import { Decimal } from "decimal.js";
import { TypeOfHoursByYear, TypeOfHoursByYearDecimal } from "types/typeOfHours";

export function enrichBalance(
  balances: TypeOfHoursByYear[]
): TypeOfHoursByYearDecimal[] {
  return balances.map(({ hours, year }) => ({
    hours: hours.map(({ typeOfHour, value }) => ({
      typeOfHour,
      value: new Decimal(value.toString()),
    })),
    year,
  }));
}
