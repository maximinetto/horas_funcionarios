import { Month } from "@prisma/client";
import InvalidValueError from "errors/InvalidValueError";
import _cloneDeep from "lodash/cloneDeep";
import _differenceBy from "lodash/differenceBy";
import _xor from "lodash/xor";
import { DateTime } from "luxon";
import { resetDateFromFirstDay } from "utils/date";
import { getMonthByNumber, getNumberByMonth } from "utils/mapMonths";

const idIsPresent = (calculation) => calculation.id != null;
export default class Calculate {
  constructor(calculationRepository) {
    this.calculationRepository = calculationRepository;
    this.calculate.bind(this);
  }

  validate = async () => {
    const {
      calculations,
      year,
      official,
      calculationRepository,
      calculationIsAfterOfDateOfEntry,
      getSmallestCalculation,
      mergeCalculations,
      allMonthsHaveHours,
      selectOptions,
    } = this;

    if (!calculations || !Array.isArray(calculations)) {
      throw new Error("calculations must be an array");
    }

    const slowestCalculation = getSmallestCalculation(calculations);

    if (
      !calculationIsAfterOfDateOfEntry(
        year,
        slowestCalculation,
        official.dateOfEntry
      )
    ) {
      throw new InvalidValueError(
        "The year and month must be after or equal the date of entry"
      );
    }

    const calculationsFromPersistence = await calculationRepository.get(
      {
        officialId: official.id,
        year: year,
      },
      selectOptions
    );

    this.calculations = mergeCalculations(calculationsFromPersistence);

    if (!allMonthsHaveHours(this.calculations)) {
      throw new InvalidValueError("All months must have hours");
    }
  };

  calculate({
    actualDate: _actualDate,
    calculations: _calculations,
    year: _year,
    official: _official,
  }) {
    const { validate, store } = this;
    store({
      calculations: _calculations,
      year: _year,
      official: _official,
      actualDate: _actualDate,
    });
    return validate();
  }

  mergeCalculations = (calculationsFromPersistence = []) => {
    const { calculations, sortLowestToHighest } = this;
    const symmetricDifference = _xor(
      calculations,
      calculationsFromPersistence,
      "month"
    );
    const differenceCalculations = _differenceBy(
      calculations,
      symmetricDifference,
      "month"
    );

    const differenceCalculationsFromPersistence = differenceCalculations.map(
      (calculation) => {
        const calculationFromPersistence = calculationsFromPersistence.find(
          (calculationFromPersistence) =>
            calculationFromPersistence.month === calculation.month
        );

        if (!calculationFromPersistence) {
          return calculation;
        }

        const { id } = calculationFromPersistence;

        return {
          id,
          ...calculation,
        };
      }
    );

    return [
      ...symmetricDifference,
      ...differenceCalculationsFromPersistence,
    ].sort(sortLowestToHighest);
  };

  calculationIsAfterOfDateOfEntry(year, calculation, dateOfEntry) {
    if (!calculation || !dateOfEntry) {
      throw new Error("calculation and dateOfEntry must be defined");
    }

    const month =
      Number(calculation.month) instanceof Number
        ? calculation.month
        : getNumberByMonth(calculation.month);

    return (
      DateTime.fromObject(
        resetDateFromFirstDay({
          year,
          month,
        })
      ).toMillis() >=
      DateTime.fromObject(
        resetDateFromFirstDay({
          year: dateOfEntry.getFullYear(),
          month: dateOfEntry.getMonth() + 1,
        })
      ).toMillis()
    );
  }

  getSmallestCalculation = (calculations) => {
    const { sortLowestToHighest } = this;

    if (calculations.length === 0) {
      return null;
    }

    return _cloneDeep(calculations).sort(sortLowestToHighest)[0];
  };

  getBiggestCalculation = (calculations) => {
    const { sortLowestToHighest } = this;
    if (calculations.length === 0) {
      return null;
    }

    return calculations
      .slice()
      .sort((a, b) => sortLowestToHighest(a, b) * -1)[0];
  };

  allMonthsHaveHours = (calculations) => {
    const { getBiggestCalculation, official } = this;
    if (
      !calculations ||
      !(Array.isArray(calculations) && calculations.length > 0)
    ) {
      throw new Error(
        "calculations must be an array and must have at least one element"
      );
    }
    const { dateOfEntry } = official;
    const dateOfEntryYear = dateOfEntry.getFullYear();
    const dateOfEntryMonth = dateOfEntry.getMonth() + 1;
    const firstMonth =
      dateOfEntryYear === calculations[0].year
        ? dateOfEntryMonth
        : getNumberByMonth(Month.JANUARY);
    const lastMonthName = getBiggestCalculation(calculations).month;
    const lastMonthNumber = getNumberByMonth(lastMonthName);
    return calculations.every((calculation) => {
      const month = getNumberByMonth(calculation.month);
      const isBetween = month >= firstMonth && month <= lastMonthNumber;
      return isBetween;
    });
  };

  sortLowestToHighest = (a, b) => {
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
  };

  calculationsWithId = (calculations = []) => calculations.filter(idIsPresent);

  calculationsWithoutId = (calculations = []) =>
    calculations.filter((calculation) => !idIsPresent(calculation));

  store = ({ calculations, year, official, actualDate }) => {
    this.calculations = this.calculationsWithMonthLikeString(calculations);
    this.actualDate = actualDate;
    this.year = year;
    this.official = official;

    return {
      calculations,
      year,
      official,
      actualDate,
      selectOptions: this.selectOptions,
    };
  };

  calculationsWithMonthLikeString = (calculations = []) =>
    calculations.map((calculation) => ({
      ...calculation,
      month:
        typeof calculation.month === "number"
          ? getMonthByNumber(calculation.month)
          : calculation.month,
    }));
}
