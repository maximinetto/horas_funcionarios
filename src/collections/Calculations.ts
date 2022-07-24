import Decimal from "decimal.js";
import Calculation from "entities/Calculation";
import _cloneDeep from "lodash/cloneDeep";
import _differenceBy from "lodash/differenceBy";
import _xorBy from "lodash/xorBy";
import CalculationSorter from "sorters/CalculationSorter";

export default class Calculations<E extends Calculation> {
  private calculationsSorter: CalculationSorter;
  private calculations: E[];

  constructor(...items: Array<E>) {
    this.calculations = items ?? [];
    this.calculationsSorter = new CalculationSorter();
    this.toPrimitiveArray.bind(this);
  }

  getBiggestCalculation = (): Calculation => {
    if (this.calculations.length === 0) {
      throw new Error("calculations must be not empty");
    }

    return this.calculations
      .slice()
      .sort(
        (a, b) => this.calculationsSorter.sortFromLowestToHighestDate(a, b) * -1
      )[0];
  };

  getSmallestCalculation(): Calculation {
    if (this.calculations.length === 0) {
      throw new Error("calculations must be not empty");
    }

    return _cloneDeep(this.calculations).sort(
      this.calculationsSorter.sortFromLowestToHighestDate
    )[0];
  }

  public calc<T extends Decimal | number | number>(
    callbackfn: (
      previousValue: T,
      currentValue: E,
      currentIndex: number,
      array: E[]
    ) => T,
    initialValue: T
  ) {
    return this.calculations.reduce(callbackfn, initialValue);
  }

  public every(callbackfn: (value: E, index: number, array: E[]) => boolean) {
    return this.calculations.every(callbackfn);
  }

  public forEach(
    callbackfn: (value: E, index: number, array: E[]) => void,
    thisArg?: any
  ) {
    this.calculations.forEach(callbackfn, thisArg);
  }

  public filter(
    predicate: (value: E, index: number, array: E[]) => boolean,
    thisArg?: any
  ) {
    return this.calculations.filter(predicate, thisArg);
  }

  public isEmpty() {
    return this.calculations.length === 0;
  }

  mergeCalculations({
    origin,
    replacer,
  }: {
    replacer: <T extends E>(replacement: T, id: string) => E;
    origin: E[];
  }): void {
    const replace = this.calculations;

    const symmetricDifference = _xorBy(replace, origin, "month");
    const differenceCalculations = _differenceBy(
      replace,
      symmetricDifference,
      "month"
    );

    const differenceCalculationsSource = differenceCalculations.map(
      (calculation) => {
        const calculationFromSource = origin.find(
          (calculationFromSource) =>
            calculationFromSource.month === calculation.month
        );

        if (!calculationFromSource) {
          return calculation;
        }

        const { id } = calculationFromSource;
        return replacer(calculation, id);
      }
    );

    const result = [...symmetricDifference, ...differenceCalculationsSource];

    this.calculations = result.sort(
      this.calculationsSorter.sortFromLowestToHighestDate
    );
  }

  public toPrimitiveArray(): E[] {
    return this.calculations;
  }

  // calculationsWithId() {
  //   return this.this.filter(this.idIsPresent);
  // }

  // calculationsWithoutId() {
  //   return this.this.filter(
  //     (calculation) => !this.idIsPresent(calculation)
  //   );
  // }

  // private idIsPresent = (calculation: Calculation): boolean =>
  //   calculation.id != null;
}
