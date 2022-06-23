import { Decimal } from "decimal.js";

import {
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "@/@types/typeOfHours";

export default class BalanceConverter {
  fromDecimalToBigInt(
    balances: TypeOfHoursByYearDecimal[]
  ): TypeOfHoursByYear[] {
    return balances.map((b) => ({
      hours: b.hours.map((h) => ({
        typeOfHour: h.typeOfHour,
        value: BigInt(h.value.toString()),
      })),
      year: b.year,
    }));
  }

  fromBigIntToDecimal(
    balances: TypeOfHoursByYear[]
  ): TypeOfHoursByYearDecimal[] {
    return balances.map((b) => ({
      hours: b.hours.map((h) => ({
        typeOfHour: h.typeOfHour,
        value: new Decimal(h.value.toString()),
      })),
      year: b.year,
    }));
  }
}
