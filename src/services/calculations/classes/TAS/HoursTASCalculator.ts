import {
  CalculationCalculated,
  CalculationParamTAS,
} from "@/@types/calculations";
import { TypeOfHour, TypeOfHourDecimal } from "@/@types/typeOfHours";
import CalculationTAS from "@/entities/CalculationTAS";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import {
  CalculationRepository,
  includeCalculationsTAS,
} from "@/persistence/calculations";
import Calculator from "@/services/calculations/classes/Calculator";
import YearsCalculator from "@/services/calculations/classes/TAS/YearsCalculator";
import HoursClass from "@/services/calculations/classes/typeOfHours";
import { Decimal } from "decimal.js";
import CalculationTASCreator from "./CalculationTASCreator";
import { hoursOfYearEnricher } from "./hourEnrich";

export default class HoursTASCalculator extends Calculator {
  protected declare calculations: CalculationTAS[];
  protected declare hourlyBalances: HourlyBalanceTAS[];
  private balancesPerYearCalculator: YearsCalculator;

  constructor(
    calculationRepository: CalculationRepository,
    balancesPerYearCalculator?: YearsCalculator
  ) {
    super(
      calculationRepository,
      new CalculationTASCreator(),
      includeCalculationsTAS()
    );
    this.balancesPerYearCalculator =
      balancesPerYearCalculator ?? new YearsCalculator();
  }

  async calculate({
    calculations,
    calculationsFromPersistence,
    year,
    official,
    hourlyBalances,
  }: CalculationParamTAS): Promise<CalculationCalculated> {
    this.hourlyBalances = hourlyBalances;

    await super.calculate({
      calculations,
      year,
      official,
      hourlyBalances,
      calculationsFromPersistence,
    });
    const [
      totalBalance,
      workingHours,
      nonWorkingHours,
      simpleHours,
      totalDiscount,
    ] = await this.calculatePerMonth(hourlyBalances);

    return this.calculateAccumulateHoursByYear({
      nonWorkingHours,
      simpleHours,
      totalBalance,
      totalDiscount,
      workingHours,
    });
  }

  calculatePerMonth(hourlyBalances: HourlyBalanceTAS[]) {
    return Promise.all([
      this.getTotalBalance(hourlyBalances),
      this.getTotalWorkingHours(),
      this.getTotalNonWorkingHours(),
      this.getTotalSimpleHours(),
      this.getTotalDiscount(),
    ]);
  }

  async calculateAccumulateHoursByYear({
    nonWorkingHours,
    simpleHours,
    totalBalance,
    totalDiscount,
    workingHours,
  }: {
    nonWorkingHours: TypeOfHourDecimal;
    simpleHours: TypeOfHour;
    totalBalance: bigint;
    totalDiscount: bigint;
    workingHours: TypeOfHourDecimal;
  }) {
    if (this.year === undefined) {
      throw new Error("year must be defined");
    }

    const hoursActualYear = hoursOfYearEnricher(
      { workingHours, nonWorkingHours, simpleHours },
      this.year
    );

    const {
      calculatedHours: balances,
      calculatedHoursSanitized: balancesSanitized,
    } = await this.balancesPerYearCalculator.calculate({
      hoursActualYear,
      hourlyBalances: this.hourlyBalances,
      totalDiscount,
    });

    return {
      calculations: this.calculations,
      totalBalance,
      workingHours,
      nonWorkingHours,
      simpleHours,
      totalDiscount,
      balances,
      balancesSanitized,
    };
  }

  getTotalBalance(hourlyBalances: HourlyBalanceTAS[]) {
    const totalHours = hourlyBalances.reduce((total, hourlyBalance) => {
      return total
        .plus(hourlyBalance.working)
        .plus(hourlyBalance.simple)
        .plus(hourlyBalance.nonWorking.toString());
    }, new Decimal(0));

    const totalBalance = this.calculations.reduce((total, calculation) => {
      const { discount } = calculation;
      const hours = calculation.getTotalHoursPerCalculation();
      return total.add(hours).sub(discount.toString());
    }, new Decimal(totalHours.toString()));

    const totalBalanceString = totalBalance.toString();
    return Promise.resolve(BigInt(totalBalanceString));
  }

  getTotalWorkingHours(): Promise<TypeOfHourDecimal> {
    const total = this.calculations.reduce(
      (total, { surplusBusiness }) =>
        total + BigInt(surplusBusiness.toString()),
      0n
    );
    const valueToDecimal = new Decimal(total.toString());
    const valueToDecimalMultiplied = valueToDecimal.mul(
      CalculationTAS.WORKING_MULTIPLIER
    );

    return Promise.resolve({
      typeOfHour: HoursClass.working,
      value: valueToDecimalMultiplied,
    });
  }

  getTotalNonWorkingHours(): Promise<TypeOfHourDecimal> {
    const total = this.calculations.reduce(
      (total, { surplusNonWorking }) =>
        total + BigInt(surplusNonWorking.toString()),
      0n
    );
    const valueToDecimal = new Decimal(total.toString());
    const valueToDecimalMultiplied = valueToDecimal.mul(
      CalculationTAS.NON_WORKING_MULTIPLIER
    );

    return Promise.resolve({
      typeOfHour: HoursClass.nonWorking,
      value: valueToDecimalMultiplied,
    });
  }

  getTotalSimpleHours(): Promise<{
    typeOfHour: TYPES_OF_HOURS;
    value: bigint;
  }> {
    const total = this.calculations.reduce(
      (total, { surplusSimple }) => total + BigInt(surplusSimple.toString()),
      0n
    );

    return Promise.resolve({
      typeOfHour: HoursClass.simple,
      value: total,
    });
  }

  getTotalDiscount(): Promise<bigint> {
    return Promise.resolve(
      this.calculations.reduce(
        (total, { discount }) => total + BigInt(discount.toString()),
        0n
      )
    );
  }
}
