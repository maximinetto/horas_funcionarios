import Calculation from "@/entities/Calculation";
import Sorter from "./Sorter";

export default class CalculationSorter extends Sorter<Calculation> {
  sortByDefault(calculations: Calculation[]) {}
}
