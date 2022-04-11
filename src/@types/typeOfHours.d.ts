import { Decimal } from "decimal.js";

export enum TYPES_OF_HOURS {
  simple = "simple",
  working = "working",
  nonWorking = "nonWorking",
}

export type TypeOfHour = {
  typeOfHour: TYPE_OF_HOURS;
  value: Decimal;
};

export interface TypeOfHoursByYear {
  year: number;
  hours: Dictionary<{ typeOfHour: TYPES_OF_HOURS; value: bigint | Decimal }>;
}
