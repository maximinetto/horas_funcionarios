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

  async calculatePerMonthAlternatives() {
    const [totalWorkingHours, totalNonWorkingHours, totalSimpleHours] =
      await Promise.all([
        this.getTotalWorkingHours(),
        this.getTotalNonWorkingHours(),
        this.getTotalSimpleHours(),
      ]);
    return {
      totalWorkingHours,
      totalNonWorkingHours,
      totalSimpleHours,
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
}
