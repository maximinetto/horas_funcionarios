import differenceBy from "lodash/differenceBy";
import Calculate from "services/calculations/classes/Calculate";
import { operations } from "persistence/hourlyBalance";

export default class CalculateForTas extends Calculate {
  constructor({ actualDate, calculations, year, officialId }) {
    super({ actualDate, calculations, year, officialId });
  }

  async calculate() {
    await this.validate();

    const { calculations, calculationsFromPersistence } = this;
    const lastBalances = await operations.getBalance();
    const allCalculations = [
      ...differenceBy(calculations, calculationsFromPersistence, "month"),
      ...calculationsFromPersistence,
    ].sort((a, b) => a.month - b.month);
  }

  async calculatePerMonth(allCalculations = [], lastBalances) {
    if (!Array.isArray(allCalculations)) {
      throw new Error("allCalculations must be an array");
    }

    return Promise.all(
      this.getTotalBalance(),
      this.getTotalWorkingHours(),
      this.getTotalNonWorkingHours(),
      this.getTotalSimpleHours(),
      this.getTotalDiscount()
    );
  }

  getTotalBalance(allCalculations, lastBalances) {
    const totalHours = lastBalances.reduce(
      (total, { working, nonWorking, simple }) =>
        total + working + nonWorking + simple,
      0
    );

    let totalBalance = totalHours;
    for (const calculation of allCalculations) {
      const { working, nonWorking, simple, discount } = calculation;
      const hours = working + nonWorking + simple;
      totalBalance = totalBalance - hours - discount;
    }

    return Promise.resolve(totalBalance);
  }

  getTotalWorkingHours(allCalculations = []) {
    return Promise.resolve(
      allCalculations.reduce((total, { working }) => total + working, 0)
    );
  }

  getTotalNonWorkingHours(allCalculations = []) {
    return Promise.resolve(
      allCalculations.reduce((total, { nonWorking }) => total + nonWorking, 0)
    );
  }

  getTotalSimpleHours(allCalculations = []) {
    return Promise.resolve(
      allCalculations.reduce((total, { simple }) => total + simple, 0)
    );
  }

  getTotalDiscount(allCalculations = []) {
    return Promise.resolve(
      allCalculations.reduce((total, { discount }) => total + discount, 0)
    );
  }

  getBalances() {
    const lastYear = this.year - 1;
    return operations.getBalance({
      officialId: this.officialId,
      year: lastYear,
    });
  }

  async withId(officialId, calculations) {}

  async withoutId(officialId, calculations) {}

  selectOptions() {
    return {
      include: {
        calculationTAS: true,
      },
    };
  }
}
