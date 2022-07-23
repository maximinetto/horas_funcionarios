import { TypeOfHourDecimal } from "types/typeOfHours";

import { CalculatePerMonthAlternative } from "../CalculatePerMonth";

export interface CalculatePerMonth extends CalculatePerMonthAlternative {
  totalWorkingHours: TypeOfHourDecimal;
  totalNonWorkingHours: TypeOfHourDecimal;
  totalSimpleHours: TypeOfHourDecimal;
}
