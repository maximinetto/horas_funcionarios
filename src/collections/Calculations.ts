import Calculation from "@/entities/Calculation";
import CalculationSorter from "@/sorters/CalculationSorter";
import _cloneDeep from "lodash/cloneDeep";
import _differenceBy from "lodash/differenceBy";
import _xorBy from "lodash/xorBy";

const idIsPresent = (calculation: Calculation): boolean =>
  calculation.id != null;

export default class Calculations {
  private calculationsSorter: CalculationSorter;

  constructor() {
    this.calculationsSorter = new CalculationSorter();
  }

  getBiggestCalculation = (calculations: Calculation[]): Calculation => {
    if (calculations.length === 0) {
      throw new Error("calculations must be not empty");
    }

    return calculations
      .slice()
      .sort(
        (a, b) => this.calculationsSorter.sortFromLowestToHighestDate(a, b) * -1
      )[0];
  };

  getSmallestCalculation(calculations: Calculation[]): Calculation {
    if (calculations.length === 0) {
      throw new Error("calculations must be not empty");
    }

    return _cloneDeep(calculations).sort(
      this.calculationsSorter.sortFromLowestToHighestDate
    )[0];
  }

  mergeCalculations(
    source: Calculation[],
    target: Calculation[],
    replacer: (calculation: Calculation, id: string) => Calculation
  ): Calculation[] {
    const symmetricDifference = _xorBy(target, source, "month");
    const differenceCalculations = _differenceBy(
      target,
      symmetricDifference,
      "month"
    );

    const differenceCalculationsFromPersistence: Calculation[] =
      differenceCalculations.map((calculation) => {
        const calculationFromPersistence = source.find(
          (calculationFromPersistence) =>
            calculationFromPersistence.month === calculation.month
        );

        if (!calculationFromPersistence) {
          return calculation;
        }

        const { id } = calculationFromPersistence;
        return replacer(calculation, id);
      });

    return [
      ...symmetricDifference,
      ...differenceCalculationsFromPersistence,
    ].sort(this.calculationsSorter.sortFromLowestToHighestDate);
  }

  calculationsWithId(calculations: Calculation[]) {
    return calculations.filter(idIsPresent);
  }

  calculationsWithoutId(calculations: Calculation[]) {
    return calculations.filter((calculation) => !idIsPresent(calculation));
  }
}
