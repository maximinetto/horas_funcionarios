import { Decimal } from "decimal.js";
import _keyBy from "lodash/keyBy";
import {
  CalculationParamTAS,
  CalculationWithTAS,
  PrismaCalculationFinderOptions,
} from "@/@types/calculations";
import { calculationTasFromArray } from "@/mappers/EntityToDTO";
import Calculate from "services/calculations/classes/Calculate";
import HoursClass, { instance as Hours } from "./typeOfHours";
import YearsCalculator from "./YearsCalculator";
import {
  TypeOfHour,
  TypeOfHoursByYear,
  TYPES_OF_HOURS,
} from "@/@types/typeOfHours";

export default class CalculateForTas extends Calculate {
  private static WORKING_MULTIPLIER = 1.5;
  private static NON_WORKING_MULTIPLIER = 2;

  constructor(calculationRepository) {
    super(calculationRepository);
  }

  calculate = async ({
    calculations,
    year,
    official,
    hourlyBalances,
  }: CalculationParamTAS) => {
    if (!year) {
      throw new Error("year must be defined");
    }

    await super.calculate({ calculations, year, official, hourlyBalances });
    const { calculatePerMonth, currentYearSanitized } = this;

    const [
      totalBalance,
      workingHours,
      nonWorkingHours,
      simpleHours,
      totalDiscount,
    ] = await calculatePerMonth(hourlyBalances);
    const hoursActualYear = currentYearSanitized(
      { workingHours, nonWorkingHours, simpleHours },
      year
    );

    const balancesPerYearCalculator = new YearsCalculator();

    const {
      calculatedHours: balances,
      calculatedHoursSanitized: balancesSanitized,
    } = await balancesPerYearCalculator.calculate({
      hoursActualYear,
      hourlyBalances,
      totalDiscount,
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

  calculatePerMonth = (hourlyBalances: any[]) => {
    return Promise.all([
      this.getTotalBalance(hourlyBalances),
      this.getTotalWorkingHours(),
      this.getTotalNonWorkingHours(),
      this.getTotalSimpleHours(),
      this.getTotalDiscount(),
    ]);
  };

  getTotalBalance = (hourlyBalances: any[]) => {
    const totalHours: BigInt = hourlyBalances.reduce(
      (total, { hourlyBalanceTAS }) =>
        total +
        hourlyBalanceTAS.working +
        hourlyBalanceTAS.nonWorking +
        hourlyBalanceTAS.simple,
      0n
    );

    console.log("hourlyBalances:", totalHours.toString());

    let totalBalance = new Decimal(totalHours.toString());
    for (const calculation of this.calculations) {
      const { calculationTAS } = calculation as CalculationWithTAS;

      if (!calculationTAS) {
        throw new Error("calculationTAS is undefined");
      }

      const { surplusBusiness, surplusNonWorking, surplusSimple, discount } =
        calculationTAS;

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

  getTotalWorkingHours = (): Promise<TypeOfHour> => {
    const { calculations } = this;
    const calculationsTAS = calculationTasFromArray(calculations);
    const total = calculationsTAS.reduce(
      (total, { surplusBusiness }) => total + surplusBusiness,
      0n
    );
    const valueToDecimal = new Decimal(total.toString());
    const valueToDecimalMultiplied = valueToDecimal.mul(
      CalculateForTas.WORKING_MULTIPLIER
    );

    return Promise.resolve({
      typeOfHour: HoursClass.working,
      value: valueToDecimalMultiplied,
    });
  };

  getTotalNonWorkingHours = (): Promise<TypeOfHour> => {
    const { calculations } = this;
    const calculationsTAS = calculationTasFromArray(calculations);
    const total = calculationsTAS.reduce(
      (total, { surplusNonWorking }) => total + surplusNonWorking,
      0n
    );
    const valueToDecimal = new Decimal(total.toString());
    const valueToDecimalMultiplied = valueToDecimal.mul(
      CalculateForTas.NON_WORKING_MULTIPLIER
    );

    return Promise.resolve({
      typeOfHour: HoursClass.nonWorking,
      value: valueToDecimalMultiplied,
    });
  };

  getTotalSimpleHours = (): Promise<{
    typeOfHour: TYPES_OF_HOURS;
    value: bigint;
  }> => {
    const { calculations } = this;
    const calculationsTAS = calculationTasFromArray(calculations);

    const total = calculationsTAS.reduce(
      (total, { surplusSimple }) => total + surplusSimple,
      0n
    );

    return Promise.resolve({
      typeOfHour: HoursClass.simple,
      value: total,
    });
  };

  getTotalDiscount = (): Promise<bigint> => {
    const { calculations } = this;
    const calculationsTAS = calculationTasFromArray(calculations);
    return Promise.resolve(
      calculationsTAS.reduce((total, { discount }) => total + discount, 0n)
    );
  };

  getTotalHoursPerCalculation = ({
    surplusBusiness,
    surplusNonWorking,
    surplusSimple,
  }: {
    surplusBusiness: bigint | number | string;
    surplusNonWorking: bigint | number | string;
    surplusSimple: bigint | number | string;
  }): Decimal => {
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
      .mul(CalculateForTas.WORKING_MULTIPLIER)
      .add(_surplusNonWorking.mul(CalculateForTas.NON_WORKING_MULTIPLIER))
      .add(_surplusSimple);
  };

  currentYearSanitized = (
    {
      workingHours,
      nonWorkingHours,
      simpleHours,
    }: {
      workingHours: { typeOfHour: TYPES_OF_HOURS; value: Decimal };
      nonWorkingHours: { typeOfHour: TYPES_OF_HOURS; value: Decimal };
      simpleHours: { typeOfHour: TYPES_OF_HOURS; value: bigint };
    },
    year: number
  ): TypeOfHoursByYear => {
    const hours = [workingHours, nonWorkingHours, simpleHours];

    const sortedHours = Hours.arrayOftypeOfHours().map((typeOfHour) => {
      const hour = hours.find(
        ({ typeOfHour: _typeOfHour }) => typeOfHour === _typeOfHour
      );
      if (!hour) {
        throw new Error("hour is undefined");
      }
      return { typeOfHour, value: hour.value };
    });

    const sortedHoursToObj = _keyBy(sortedHours, "typeOfHour");
    Object.entries(sortedHoursToObj).forEach(([key, value]) => {
      sortedHoursToObj[key].value = value.value;
    });

    return {
      year,
      hours: sortedHoursToObj,
    };
  };

  selectOptions = (): PrismaCalculationFinderOptions => {
    return {
      include: {
        calculationTAS: true,
      },
    };
  };
}
