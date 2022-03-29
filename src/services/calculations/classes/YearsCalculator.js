import { instance as Hours } from "./typeOfHours";

export default class YearsCalculator {
  constructor() {
    this.lastBalances = [];
    this.hoursActualYear = [];
    this.totalDiscount = 0;
    this.calculatedHours = [];
  }

  async calculate({
    lastBalances: _lastBalances,
    hoursActualYear: _hoursActualYear,
    totalDiscount: _totalDiscount,
  }) {
    const { store, calculateTypesOfHours, calculatedHoursSanitized } = this;

    const { calculatedHours, hoursActualYear, lastBalances } = store({
      lastBalances: _lastBalances,
      hoursActualYear: _hoursActualYear,
      totalDiscount: _totalDiscount,
    });

    const balances = [...lastBalances, ...hoursActualYear];

    for (const balance of balances) {
      const { simple, working, nonWorking, year } = balance;

      calculateTypesOfHours({
        year,
        hours: [simple, working, nonWorking],
      });
    }

    return {
      calculatedHours: [...calculatedHours],
      calculatedHoursSanitized: calculatedHoursSanitized(),
    };
  }

  calculateTypesOfHours({ year, hours }) {
    const { sumHours, storeHours } = this;
    hours.forEach((hour, index) => {
      const typeOfHour = Hours.getTypeOfHourByIndex(index);
      const previousHours = this.getPreviousHours({
        currentYear: year,
        typeOfHour,
      });
      const sum = sumHours(hour, previousHours);
      storeHours({ typeOfHour, year, value: sum });
    });
  }

  store({
    lastBalances: _lastBalances,
    hoursActualYear: _hoursActualYear,
    totalDiscount: _totalDiscount,
  }) {
    const { lastBalances, hoursActualYear, calculatedHours, totalDiscount } =
      this;

    lastBalances = [..._lastBalances];
    hoursActualYear = [..._hoursActualYear];
    totalDiscount = _totalDiscount || 0;

    return {
      lastBalances,
      hoursActualYear,
      calculatedHours,
      totalDiscount,
    };
  }

  calculatedHoursSanitized() {
    const { calculatedHours } = this;
    return calculatedHours.map((calculatedHour) => ({
      ...calculatedHour,
      hours: calculatedHour.hours.map(({ typeOfHour, value }) => ({
        typeOfHour,
        value: value >= 0 ? value : 0,
      })),
    }));
  }

  sumHours(hour, accumulatedHours) {
    if (accumulatedHours == null) {
      return hour - this.totalDiscount;
    }
    return accumulatedHours < 0 ? hour + accumulatedHours : hour;
  }

  getPreviousHours({ currentYear, typeOfHour }) {
    const { calculatedHours } = this;
    if (calculatedHours.length === 0) {
      return null;
    }
    const yearToSearch = this.isFirstTypeOfHour()
      ? currentYear - 1
      : currentYear;
    const yearSearched = calculatedHours.find(
      ({ year }) => year === yearToSearch
    );
    if (!yearSearched) {
      throw new Error("You must have a valid year");
    }

    const { hours: previousHours } = yearSearched;
    const previousHour = previousHours.find(
      ({ typeOfHour: _typeOfHour }) => _typeOfHour === typeOfHour
    );
    if (!previousHour) {
      throw new Error("You must have a previous hour");
    }

    return previousHour.value;
  }

  storeHours({ typeOfHour, year, value }) {
    const { calculatedHours } = this;

    if (Hours.isFirstTypeOfHour(typeOfHour)) {
      return calculatedHours.push({
        year,
        hours: [{ typeOfHour, value }],
      });
    }

    const yearSearched = calculatedHours.find(
      ({ year: _year }) => _year === year
    );
    if (!yearSearched) {
      throw new Error("You must have a valid year");
    }

    const { hours } = yearSearched;
    hours.push({ typeOfHour, value });
  }
}
