import Calculation from "@/entities/Calculation";
import numberSorter from "@/utils/numberSorter";
import { Dictionary } from "lodash";
import _groupBy from "lodash/groupBy";

export default function groupAndSortCalculations(calculations: Calculation[]) {
  const calculationsGrouped = _groupBy(calculations, "year");

  return sortCalculations(calculationsGrouped);
}

function sortCalculations(entries: Dictionary<Calculation[]>) {
  const result = Object.entries(entries);
  result.sort(([ya], [yb]) => numberSorter(Number(ya), Number(yb)));
  return result;
}
