import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import { Decimal } from "decimal.js";

export type TypeOfHour = {
  typeOfHour: TYPES_OF_HOURS;
  value: bigint;
};

export type TypeOfHourDecimal = {
  typeOfHour: TYPES_OF_HOURS;
  value: Decimal;
};

export interface TypeOfHoursByYear {
  year: number;
  hours: { typeOfHour: TYPES_OF_HOURS; value: bigint | Decimal }[];
}

export interface TypeOfHoursByYearDecimal {
  year: number;
  hours: { typeOfHour: TYPES_OF_HOURS; value: Decimal }[];
}
