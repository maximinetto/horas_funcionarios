import { instance as Hours } from "./typeOfHours";

export default class YearsCalculator {
  constructor({ lastBalances, hoursActualYear, totalDiscount, currentYear }) {
    this.lastBalances = [...lastBalances];
    this.hoursActualYear = [...hoursActualYear];
    this.totalDiscount = totalDiscount;
    this.currentYear = currentYear;
    this.calculatedHours = [];
  }

  async calculate() {
    const { lastBalances, hoursActualYear } = this;
    const balances = [...lastBalances, ...hoursActualYear];

    for (const balance of balances) {
      const { simple, working, nonWorking, year } = balance;

      this.calculateTypesOfHours({
        year,
        hours: [simple, working, nonWorking],
      });
    }
  }

  calculateTypesOfHours({ year, hours }) {
    hours.forEach((hour, index) => {
      const typeOfHour = Hours.getTypeOfHourByIndex(index);
      const previousHours = this.getPreviousHours({
        currentYear: year,
        typeOfHour,
      });
      const sum = this.sumHours(hour, previousHours);
      this.storeHours({ typeOfHour, year, value: sum });
    });
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
