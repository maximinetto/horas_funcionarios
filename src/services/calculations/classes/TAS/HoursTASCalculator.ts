import Calculations from "collections/Calculations";
import { Decimal } from "decimal.js";
import CalculationTAS from "entities/CalculationTAS";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import CalculationRepository from "persistence/Calculation/CalculationRepository";
import { includeCalculationsTAS } from "persistence/Calculation/PrismaCalculationRepository";
import HoursCalculator from "services/calculations/classes/HoursCalculator";
import BalancesPerYearCalculator from "services/calculations/classes/TAS/YearsCalculator";
import HoursClass from "services/calculations/classes/typeOfHours";
import CalculationSorter from "sorters/CalculationSorter";
import { CalculationCalculated } from "types/calculations";
import { TypeOfHourDecimal } from "types/typeOfHours";

import CalculationValidator from "../CalculationValidator";
import CalculationTASCreator from "./CalculationTASCreator";
import { hoursOfYearEnricher } from "./hourEnrich";

export default class HoursTASCalculator extends HoursCalculator {
  protected declare calculations: Calculations<CalculationTAS>;
  protected declare hourlyBalances: Array<HourlyBalanceTAS>;
  private balancesPerYearCalculator: BalancesPerYearCalculator;

  constructor({
    balancesPerYearCalculator,
    calculationRepository,
    calculationSorter,
    calculationValidator,
  }: {
    calculationRepository: CalculationRepository;
    calculationValidator: CalculationValidator;
    calculationSorter: CalculationSorter;
    balancesPerYearCalculator: BalancesPerYearCalculator;
  }) {
    super({
      calculationRepository,
      calculationValidator,
      calculationSorter,
      calculationCreator: new CalculationTASCreator(),
      selectOptions: includeCalculationsTAS(),
    });

    this.balancesPerYearCalculator = balancesPerYearCalculator;
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
      calculations: this.calculations.toPrimitiveArray(),
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
    const total = this.calculations.calc(
      (_total, { surplusBusiness }) => _total.plus(surplusBusiness),
      new Decimal(0)
    );
    const valueMultiplied = total.mul(CalculationTAS.WORKING_MULTIPLIER);

    return Promise.resolve({
      typeOfHour: HoursClass.working,
      value: valueMultiplied,
    });
  }

  getTotalNonWorkingHours(): Promise<TypeOfHourDecimal> {
    const total = this.calculations.calc(
      (_total, { surplusNonWorking }) => _total.plus(surplusNonWorking),
      new Decimal(0)
    );
    const valueMultiplied = total.mul(CalculationTAS.NON_WORKING_MULTIPLIER);

    return Promise.resolve({
      typeOfHour: HoursClass.nonWorking,
      value: valueMultiplied,
    });
  }

  getTotalSimpleHours(): Promise<TypeOfHourDecimal> {
    const total = this.calculations.calc(
      (_total, { surplusSimple }) => _total.plus(surplusSimple),
      new Decimal(0)
    );

    return Promise.resolve({
      typeOfHour: HoursClass.simple,
      value: total,
    });
  }
}
