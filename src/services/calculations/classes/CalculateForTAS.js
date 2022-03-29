import _keyBy from "lodash/keyBy";
import Calculate from "services/calculations/classes/Calculate";
import { operations } from "persistence/hourlyBalance";
import YearsCalculator from "./YearsCalculator";
import { instance as Hours } from "./typeOfHours";

export default class CalculateForTas extends Calculate {
  constructor(calculationRepository) {
    super(calculationRepository);
  }

  async calculate({ actualDate, calculations, year, official }) {
    super.calculate({ actualDate, calculations, year, official });
    const { calculatePerMonth, calculationRepository } = this;
    const lastBalances = await calculationRepository.getBalance({
      officialId: official.id,
      year,
    });

    const [
      totalBalance,
      workingHours,
      nonWorkingHours,
      simpleHours,
      totalDiscount,
    ] = await calculatePerMonth(lastBalances);

    const hours = [workingHours, nonWorkingHours, simpleHours];

    const sortedHours = Hours.arrayOftypeOfHours().map((typeOfHour) => {
      const hour = hours.find(
        ({ typeOfHour: _typeOfHour }) => typeOfHour === _typeOfHour
      );
      return { typeOfHour, value: hour.value };
    });

    const sortedHoursToObj = _keyBy(sortedHours, "typeOfHour");
    Object.entries(sortedHoursToObj).forEach(([key, value]) => {
      sortedHoursToObj[key] = value.value;
    });

    const sortedHoursWithYear = {
      year,
      ...sortedHoursToObj,
    };

    const balancesPerYearCalculator = new YearsCalculator({
      lastBalances,
      hoursActualYear: sortedHoursWithYear,
      totalDiscount,
    });

    const {
      calculatedHours: balances,
      calculatedHoursSanitized: balancesSanitized,
    } = await balancesPerYearCalculator.calculate();

    this.mutateInPersistence({
      balances: balancesSanitized,
      totalDiscount,
      totalBalance,
    });

    return {
      calculations,
      totalBalance,
      workingHours,
      nonWorkingHours,
      simpleHours,
      totalDiscount,
      balances,
      balancesSanitized,
    };
  }

  async calculatePerMonth(lastBalances) {
    const { calculations } = this;
    if (!Array.isArray()) {
      throw new Error("allCalculations must be an array");
    }

    return Promise.all([
      this.getTotalBalance(lastBalances),
      this.getTotalWorkingHours(calculations),
      this.getTotalNonWorkingHours(calculations),
      this.getTotalSimpleHours(calculations),
      this.getTotalDiscount(calculations),
    ]);
  }

  mutateInPersistence({ balances, totalDiscount, totalBalance }) {
    const { calculations, officialId, year } = this;
    balances.map(({ hours, year }) => ({ hours }));
  }

  getTotalBalance(lastBalances) {
    const totalHours = lastBalances.reduce(
      (total, { working, nonWorking, simple }) =>
        total + working + nonWorking + simple,
      0
    );

    let totalBalance = totalHours;
    for (const calculation of this.calculations) {
      const { surplusBusiness, surplusNonWorking, surplusSimple, discount } =
        calculation;
      const hours = this.getTotalHoursPerCalculation({
        surplusBusiness,
        surplusNonWorking,
        surplusSimple,
      });
      totalBalance = totalBalance - hours - discount;
    }

    return Promise.resolve(totalBalance);
  }

  getTotalWorkingHours() {
    return Promise.resolve({
      typeOfHour: Hours.working,
      value: this.calculations.reduce(
        (total, { surplusBusiness }) => total + surplusBusiness,
        0
      ),
    });
  }

  getTotalNonWorkingHours() {
    return Promise.resolve({
      typeOfHour: Hours.nonWorking,
      value: this.calculations.reduce(
        (total, { surplusNonWorking }) => total + surplusNonWorking,
        0
      ),
    });
  }

  getTotalSimpleHours() {
    return Promise.resolve({
      typeOfHour: Hours.simple,
      value: this.calculations.reduce(
        (total, { surplusSimple }) => total + surplusSimple,
        0
      ),
    });
  }

  getTotalDiscount() {
    return Promise.resolve(
      this.calculations.reduce((total, { discount }) => total + discount, 0)
    );
  }

  getTotalHoursPerCalculation({
    surplusBusiness,
    surplusNonWorking,
    surplusSimple,
  }) {
    return surplusBusiness * 1.5 + surplusNonWorking * 2 + surplusSimple;
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
