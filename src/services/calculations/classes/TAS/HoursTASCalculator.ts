import { CalculationCalculated } from "@/@types/calculations";
import { TypeOfHourDecimal } from "@/@types/typeOfHours";
import CalculationTAS from "@/entities/CalculationTAS";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
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

  async calculatePerMonth(hourlyBalances: HourlyBalanceTAS[]): Promise<{
    totalBalance: Decimal;
    totalDiscount: Decimal;
    totalWorkingHours: TypeOfHourDecimal;
    totalNonWorkingHours: TypeOfHourDecimal;
    totalSimpleHours: TypeOfHourDecimal;
  }> {
    const [
      totalBalance,
      totalWorkingHours,
      totalNonWorkingHours,
      totalSimpleHours,
      totalDiscount,
    ] = await Promise.all([
      this.getTotalBalance(hourlyBalances),
      this.getTotalWorkingHours(),
      this.getTotalNonWorkingHours(),
      this.getTotalSimpleHours(),
      this.getTotalDiscount(),
    ]);
    return {
      totalBalance,
      totalWorkingHours,
      totalNonWorkingHours,
      totalSimpleHours,
      totalDiscount,
    };
  }

  async calculateAccumulateHoursByYear({
    totalBalance,
    totalWorkingHours,
    totalNonWorkingHours,
    totalSimpleHours,
    totalDiscount,
  }: {
    totalBalance: Decimal;
    totalDiscount: Decimal;
    totalWorkingHours: TypeOfHourDecimal;
    totalNonWorkingHours: TypeOfHourDecimal;
    totalSimpleHours: TypeOfHourDecimal;
  }): Promise<CalculationCalculated> {
    if (this.year === undefined) {
      throw new Error("year must be defined");
    }

    const hoursActualYear = hoursOfYearEnricher(
      {
        workingHours: totalWorkingHours,
        nonWorkingHours: totalNonWorkingHours,
        simpleHours: totalSimpleHours,
      },
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
      totalWorkingHours,
      totalNonWorkingHours,
      totalSimpleHours,
      totalDiscount,
      balances,
      balancesSanitized,
    };
  }

  getTotalBalance(hourlyBalances: HourlyBalanceTAS[]): Promise<Decimal> {
    const totalHours = hourlyBalances.reduce((total, hourlyBalance) => {
      return total
        .plus(hourlyBalance.working)
        .plus(hourlyBalance.simple)
        .plus(hourlyBalance.nonWorking);
    }, new Decimal(0));

    const totalBalance = this.calculations.reduce((total, calculation) => {
      const { discount } = calculation;
      const hours = calculation.getTotalHoursPerCalculation();
      return total.add(hours).sub(discount);
    }, new Decimal(totalHours));

    return Promise.resolve(totalBalance);
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

  getTotalSimpleHours(): Promise<TypeOfHourDecimal> {
    const total = this.calculations.reduce(
      (total, { surplusSimple }) => total.plus(surplusSimple),
      new Decimal(0)
    );

    return Promise.resolve({
      typeOfHour: HoursClass.simple,
      value: total,
    });
  }

  getTotalDiscount(): Promise<Decimal> {
    return Promise.resolve(
      this.calculations.reduce(
        (total, { discount }) => total.plus(discount),
        new Decimal(0)
      )
    );
  }
}
