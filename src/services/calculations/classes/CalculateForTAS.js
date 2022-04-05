import { Decimal } from "decimal.js";
import _keyBy from "lodash/keyBy";
import Calculate from "services/calculations/classes/Calculate";
import HoursClass, { instance as Hours } from "./typeOfHours";
import YearsCalculator from "./YearsCalculator";

const WORKING_MULTIPLIER = 1.5;
const NON_WORKING_MULTIPLIER = 2;
export default class CalculateForTas extends Calculate {
  constructor(calculationRepository) {
    super(calculationRepository);
  }

  calculate = async ({ actualDate, calculations, year, official }) => {
    await super.calculate({ actualDate, calculations, year, official });
    const { calculatePerMonth, calculationRepository, currentYearSanitized } =
      this;
    const lastBalances = await calculationRepository.getBalance({
      officialId: official.id,
      year: year - 1,
    });

    const [
      totalBalance,
      workingHours,
      nonWorkingHours,
      simpleHours,
      totalDiscount,
    ] = await calculatePerMonth(lastBalances);
    const hoursActualYear = currentYearSanitized(
      { workingHours, nonWorkingHours, simpleHours },
      year
    );

    const balancesPerYearCalculator = new YearsCalculator({
      lastBalances,
      hoursActualYear,
      totalDiscount,
    });

    const {
      calculatedHours: balances,
      calculatedHoursSanitized: balancesSanitized,
    } = await balancesPerYearCalculator.calculate({
      hoursActualYear,
      lastBalances,
      totalDiscount,
    });

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
  };

  calculatePerMonth = (lastBalances) => {
    const { calculations } = this;
    if (!Array.isArray(calculations)) {
      throw new Error("allCalculations must be an array");
    }

    return Promise.all([
      this.getTotalBalance(lastBalances),
      this.getTotalWorkingHours(),
      this.getTotalNonWorkingHours(),
      this.getTotalSimpleHours(),
      this.getTotalDiscount(),
    ]);
  };

  mutateInPersistence = ({ balances, totalDiscount, totalBalance }) => {
    const { calculations, officialId, year } = this;
    balances.map(({ hours, year }) => ({ hours }));
  };

  getTotalBalance = (lastBalances) => {
    const totalHours = lastBalances.reduce(
      (total, { working, nonWorking, simple }) =>
        total + working + nonWorking + simple,
      0n
    );

    console.log("lastBalance:", totalHours.toString());

    let totalBalance = new Decimal(totalHours.toString());
    for (const calculation of this.calculations) {
      const { surplusBusiness, surplusNonWorking, surplusSimple, discount } =
        calculation;

      console.log(
        "calculation:",
        surplusBusiness,
        surplusNonWorking,
        surplusSimple,
        discount
      );
      const hours = this.getTotalHoursPerCalculation({
        surplusBusiness,
        surplusNonWorking,
        surplusSimple,
      });
      totalBalance = totalBalance.add(hours).sub(discount.toString());
    }

    const totalBalanceString = totalBalance.toString();
    console.log("total", totalBalanceString, totalBalance);
    const totalBalanceBigInt = BigInt(totalBalanceString);

    return Promise.resolve(totalBalanceBigInt);
  };

  getTotalWorkingHours = () => {
    const { calculations } = this;

    const total = calculations.reduce(
      (total, { surplusBusiness }) => total + surplusBusiness,
      0n
    );
    const valueToDecimal = new Decimal(total.toString());
    const valueToDecimalMultiplied = valueToDecimal.mul(WORKING_MULTIPLIER);

    return Promise.resolve({
      typeOfHour: HoursClass.working,
      value: valueToDecimalMultiplied,
    });
  };

  getTotalNonWorkingHours = () => {
    const { calculations } = this;

    const total = calculations.reduce(
      (total, { surplusNonWorking }) => total + surplusNonWorking,
      0n
    );
    const valueToDecimal = new Decimal(total.toString());
    const valueToDecimalMultiplied = valueToDecimal.mul(NON_WORKING_MULTIPLIER);

    return Promise.resolve({
      typeOfHour: HoursClass.nonWorking,
      value: valueToDecimalMultiplied,
    });
  };

  getTotalSimpleHours = () => {
    const { calculations } = this;

    const total = calculations.reduce(
      (total, { surplusSimple }) => total + surplusSimple,
      0n
    );

    return Promise.resolve({
      typeOfHour: HoursClass.simple,
      value: total,
    });
  };

  getTotalDiscount = () => {
    const { calculations } = this;
    return Promise.resolve(
      calculations.reduce((total, { discount }) => total + discount, 0n)
    );
  };

  getTotalHoursPerCalculation = ({
    surplusBusiness,
    surplusNonWorking,
    surplusSimple,
  }) => {
    const _surplusBusiness = new Decimal(
      typeof surplusBusiness === "bigint" || typeof surplusBusiness === "number"
        ? surplusBusiness.toString()
        : surplusBusiness
    );

    const _surplusNonWorking = new Decimal(
      typeof surplusNonWorking === "bigint" ||
      typeof surplusNonWorking === "number"
        ? surplusNonWorking.toString()
        : surplusNonWorking
    );

    const _surplusSimple = new Decimal(
      typeof surplusSimple === "bigint" || typeof surplusSimple === "number"
        ? surplusSimple.toString()
        : surplusSimple
    );

    return _surplusBusiness
      .mul(WORKING_MULTIPLIER)
      .add(_surplusNonWorking.mul(NON_WORKING_MULTIPLIER))
      .add(_surplusSimple);
  };

  async withId(officialId, calculations) {}

  async withoutId(officialId, calculations) {}

  currentYearSanitized = (
    { workingHours, nonWorkingHours, simpleHours },
    year
  ) => {
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

    return sortedHoursWithYear;
  };

  selectOptions = () => {
    return {
      include: {
        calculationTAS: true,
      },
    };
  };
}
