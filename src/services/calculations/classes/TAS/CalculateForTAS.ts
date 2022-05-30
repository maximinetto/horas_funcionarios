import {
  CalculationCalculated,
  CalculationParamTAS,
} from "@/@types/calculations";
import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import { TypeOfHour } from "@/@types/typeOfHours";
import CalculationTAS from "@/entities/CalculationTAS";
import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import {
  CalculationRepository,
  includeCalculationsTAS,
} from "@/persistence/calculations";
import Calculate from "@/services/calculations/classes/Calculate";
import YearsCalculator from "@/services/calculations/classes/TAS/YearsCalculator";
import HoursClass from "@/services/calculations/classes/typeOfHours";
import { Decimal } from "decimal.js";
import { hoursOfYearEnricher } from "./hourEnrich";

export default class CalculateForTas extends Calculate {
  protected hourlyBalances: HourlyBalanceTAS[];
  protected calculations: CalculationTAS[];
  private balancesPerYearCalculator: YearsCalculator;

  constructor(
    calculationRepository: CalculationRepository,
    balancesPerYearCalculator?: YearsCalculator
  ) {
    super(calculationRepository);
    this.hourlyBalances = [];
    this.calculations = [];
    this.calculatePerMonth.bind(this);
    this.calculateAccumulateHoursByYear.bind(this);
    this.getTotalBalance.bind(this);
    this.getTotalWorkingHours.bind(this);
    this.getTotalDiscount.bind(this);
    this.getTotalSimpleHours.bind(this);
    this.getTotalNonWorkingHours.bind(this);
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

    const results = await this.calculateAccumulateHoursByYear({
      nonWorkingHours,
      simpleHours,
      totalBalance,
      totalDiscount,
      workingHours,
    });

    return results;
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

  getTotalBalance(hourlyBalances: HourlyBalanceTAS[]): Promise<bigint> {
    const totalHours: BigInt = hourlyBalances.reduce(
      (total, { hourlyBalanceTAS }) => {
        if (hourlyBalanceTAS) {
          return (
            total +
            hourlyBalanceTAS.working +
            hourlyBalanceTAS.nonWorking +
            hourlyBalanceTAS.simple
          );
        }

        return total + 0n;
      },
      0n
    );

    const totalBalance = this.calculations.reduce((total, calculation) => {
      const { discount } = calculation;
      const hours = calculation.getTotalHoursPerCalculation();
      return total.add(hours).sub(discount.toString());
    }, new Decimal(totalHours.toString()));

    const totalBalanceString = totalBalance.toString();
    return Promise.resolve(BigInt(totalBalanceString));
  }

  getTotalWorkingHours(): Promise<TypeOfHour> {
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

  getTotalNonWorkingHours(): Promise<TypeOfHour> {
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

  selectOptions() {
    return includeCalculationsTAS();
  }
}
