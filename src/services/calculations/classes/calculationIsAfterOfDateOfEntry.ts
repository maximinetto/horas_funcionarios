import Calculation from "@/entities/Calculation";
import { resetDateFromFirstDay } from "@/utils/date";
import { getNumberByMonth } from "@/utils/mapMonths";
import { DateTime } from "luxon";

export default function calculationIsAfterOfDateOfEntry(
  year: number,
  calculation: Calculation,
  dateOfEntry: DateTime
) {
  const monthNumber = Number(calculation.month);
  const month = isNaN(monthNumber)
    ? getNumberByMonth(calculation.month)
    : monthNumber;

  return (
    DateTime.fromObject(
      resetDateFromFirstDay({
        year,
        month,
      })
    ).toMillis() >=
    DateTime.fromObject(
      resetDateFromFirstDay({
        year: dateOfEntry.year,
        month: dateOfEntry.month,
      })
    ).toMillis()
  );
}
