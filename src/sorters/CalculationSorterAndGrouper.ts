import Calculation from "entities/Calculation";
import { Dictionary } from "lodash";
import _groupBy from "lodash/groupBy";
import numberSorter from "utils/numberSorter";

export default function groupAndSortCalculations<E extends Calculation>(
  calculations: E[]
) {
  const calculationsGrouped = _groupBy(calculations, "year");

  return sortCalculations(calculationsGrouped);
}

function sortCalculations<E extends Calculation>(entries: Dictionary<E[]>) {
  const result = Object.entries(entries);
  result.sort(([ya], [yb]) => numberSorter(Number(ya), Number(yb)));
  return result;
}
