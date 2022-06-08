import Calculation from "@/entities/Calculation";
import CalculationSorter from "@/sorters/CalculationSorter";
import _cloneDeep from "lodash/cloneDeep";
import _differenceBy from "lodash/differenceBy";
import _xorBy from "lodash/xorBy";

export default class Calculations {
  private calculationsSorter: CalculationSorter;
  private _calculations: Calculation[];
  constructor() {
    this.calculationsSorter = new CalculationSorter();
    this._calculations = [];
  }

  getBiggestCalculation = (calculations?: Calculation[]): Calculation => {
    const _calculations = calculations ?? this._calculations;
    if (_calculations.length === 0) {
      throw new Error("calculations must be not empty");
    }

    return _calculations
      .slice()
      .sort(
        (a, b) => this.calculationsSorter.sortFromLowestToHighestDate(a, b) * -1
      )[0];
  };

  getSmallestCalculation(calculations?: Calculation[]): Calculation {
    const _calculations = calculations ?? this._calculations;
    if (_calculations.length === 0) {
      throw new Error("calculations must be not empty");
    }

    return _cloneDeep(_calculations).sort(
      this.calculationsSorter.sortFromLowestToHighestDate
    )[0];
  }

  mergeCalculations({
    origin,
    replace,
    replacer,
  }: {
    replacer: (calculation: Calculation, id: string) => Calculation;
    replace: Calculation[];
    origin?: Calculation[];
  }): Calculation[] {
    const _origin = origin ?? this._calculations;

    const symmetricDifference = _xorBy(replace, _origin, "month");
    const differenceCalculations = _differenceBy(
      replace,
      symmetricDifference,
      "month"
    );

    const differenceCalculationsSource: Calculation[] =
      differenceCalculations.map((calculation) => {
        const calculationFromSource = _origin.find(
          (calculationFromSource) =>
            calculationFromSource.month === calculation.month
        );

        if (!calculationFromSource) {
          return calculation;
        }

        const { id } = calculationFromSource;
        return replacer(calculation, id);
      });

    return [...symmetricDifference, ...differenceCalculationsSource].sort(
      this.calculationsSorter.sortFromLowestToHighestDate
    );
  }

  calculationsWithId(calculations?: Calculation[]) {
    const _calculations = calculations ?? this._calculations;

    return _calculations.filter(this.idIsPresent);
  }

  calculationsWithoutId(calculations?: Calculation[]) {
    const _calculations = calculations ?? this._calculations;

    return _calculations.filter(
      (calculation) => !this.idIsPresent(calculation)
    );
  }

  private idIsPresent = (calculation: Calculation): boolean =>
    calculation.id != null;
}
