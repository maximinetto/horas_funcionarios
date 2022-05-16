import {
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "@/@types/typeOfHours";
import { Decimal } from "decimal.js";

const expectBalance = (actual: TypeOfHoursByYear[]) => {
  return {
    toBe: (expected: TypeOfHoursByYearDecimal[]) => {
      const actualSanitized = actual.map((balance) => ({
        year: balance.year,
        hours: balance.hours.map((hour) => ({
          typeOfHour: hour.typeOfHour,
          value: new Decimal(hour.value.toString()),
        })),
      }));

      expect(actualSanitized).toEqual(expected);
    },
  };
};
export default expectBalance;
