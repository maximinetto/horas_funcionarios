import { instance as Hours } from "./typeOfHours";

export default class YearsCalculator {
  constructor() {
    this.lastBalances = [];
    this.hoursActualYear = [];
    this.totalDiscount = 0;
    this.calculatedHours = [];
  }

  async calculate({ lastBalances, hoursActualYear, totalDiscount }) {
    const { store, calculateTypesOfHours, calculatedHoursSanitized } = this;

    const {
      calculatedHours,
      hoursActualYear: _hoursActualYear,
      lastBalances: _lastBalances,
    } = store({
      lastBalances: lastBalances,
      hoursActualYear: hoursActualYear,
      totalDiscount: totalDiscount,
    });

    const balances = [..._lastBalances, _hoursActualYear];

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

  calculateTypesOfHours = ({ year, hours }) => {
    const { sumHours, storeHours, getPreviousHours } = this;
    hours.forEach((hour, index) => {
      const typeOfHour = Hours.getTypeOfHourByIndex(index);
      const previousHours = getPreviousHours({
        currentYear: year,
        typeOfHour,
      });
      const sum = sumHours(hour, previousHours);
      storeHours({ typeOfHour, year, value: sum });
    });
  };

  store = ({
    lastBalances: _lastBalances,
    hoursActualYear: _hoursActualYear,
    totalDiscount: _totalDiscount,
  }) => {
    this.lastBalances = [..._lastBalances];
    this.hoursActualYear = { ..._hoursActualYear };
    this.totalDiscount = _totalDiscount > 0 ? _totalDiscount : 0n;

    return {
      lastBalances: this.lastBalances,
      hoursActualYear: this.hoursActualYear,
      calculatedHours: this.calculatedHours,
      totalDiscount: this.totalDiscount,
    };
  };

  calculatedHoursSanitized = () => {
    const { calculatedHours } = this;
    return calculatedHours.map((calculatedHour) => ({
      ...calculatedHour,
      hours: calculatedHour.hours.map(({ typeOfHour, value }) => ({
        typeOfHour,
        value: value >= 0 ? value : 0,
      })),
    }));
  };

  sumHours = (hour, accumulatedHours) => {
    if (accumulatedHours == null) {
      return hour - this.totalDiscount;
    }
    return accumulatedHours < 0 ? hour + accumulatedHours : hour;
  };

  getPreviousHours = ({ currentYear, typeOfHour }) => {
    const { calculatedHours } = this;
    if (calculatedHours.length === 0) {
      return null;
    }
    const yearToSearch = Hours.isFirstTypeOfHour(typeOfHour)
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
      ({ typeOfHour: _typeOfHour }) =>
        _typeOfHour === Hours.getPreviousTypeOfHour(typeOfHour)
    );
    if (!previousHour) {
      throw new Error("You must have a previous hour");
    }

    return previousHour.value;
  };

  storeHours = ({ typeOfHour, year, value }) => {
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
  };
}
