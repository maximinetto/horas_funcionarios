export default interface Comparable<T> {
  compareTo(other: T): number;
}

export class Comparator {
  static compare<T extends Comparable<T>>(a: T, b: T): number {
    if (a === b) {
      return 0;
    }
    if (a == null) {
      return -1;
    }
    if (b == null) {
      return 1;
    }
    if (typeof a.compareTo === "function") {
      return a.compareTo(b);
    }
    if (typeof b.compareTo === "function") {
      return -b.compareTo(a);
    }
    throw new Error("Unable to compare " + a + " and " + b);
  }
}
