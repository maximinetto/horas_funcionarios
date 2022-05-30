import {
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "@/@types/typeOfHours";
import { Decimal } from "decimal.js";

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
