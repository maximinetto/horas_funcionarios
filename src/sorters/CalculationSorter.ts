import Calculation from "entities/Calculation";
import { DateTime } from "luxon";
import { resetDateFromFirstDay } from "utils/date";
import { getNumberByMonth } from "utils/mapMonths";
import numberSorter from "utils/numberSorter";

import Sorter from "./Sorter";

export default class CalculationSorter extends Sorter<Calculation> {
  sort(calculations: Calculation[]) {}

  sortFromLowestToHighestDate(a: Calculation, b: Calculation) {
    const monthA = getNumberByMonth(a.month);
    const monthB = getNumberByMonth(b.month);

    return (
      DateTime.fromObject(
        resetDateFromFirstDay({ year: a.year, month: monthA })
      ).toMillis() -
      DateTime.fromObject(
        resetDateFromFirstDay({ year: b.year, month: monthB })
      ).toMillis()
    );
  }

  sortFromLowestToHighestYear(a: Calculation, b: Calculation) {
    return numberSorter(a.year, b.year);
  }
}
