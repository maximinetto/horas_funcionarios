import Comparable, { Comparator } from "utils/Comparator";

export default abstract class Sorter<T extends Comparable<T>> {
  public sortByDefault(items: T[]): T[] {
    return items.sort(Comparator.compare);
  }
}
