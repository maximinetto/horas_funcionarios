import {
  CalculationParamTAS,
  CalculationTAS,
  PrismaCalculationFinderOptions,
} from "@/@types/calculations";
import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import {
  TypeOfHour,
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "@/@types/typeOfHours";
import { logger } from "@/config";
import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import { calculationTasFromArray } from "@/mappers/EntityToDTO";
import { CalculationRepository } from "@/persistence/calculations";
import Calculate from "@/services/calculations/classes/Calculate";
import HoursClass, {
  instance as Hours,
} from "@/services/calculations/classes/typeOfHours";
import YearsCalculator from "@/services/calculations/classes/YearsCalculator";
import { Decimal } from "decimal.js";

export default class CalculateForTas extends Calculate {
  private static WORKING_MULTIPLIER = 1.5;
  private static NON_WORKING_MULTIPLIER = 2;

  protected hourlyBalances: HourlyBalanceTAS[];
  protected calculations: CalculationTAS[];

  constructor(calculationRepository: CalculationRepository) {
    super(calculationRepository);
    this.hourlyBalances = [];
    this.calculations = [];
    this.calculatePerMonth.bind(this);
    this.currentYearSanitized.bind(this);
    this.calculateAccumulateHoursByYear.bind(this);
  }

  calculate({
    calculations,
    year,
    official,
    hourlyBalances,
  }: CalculationParamTAS): Promise<{
    calculations: CalculationTAS[];
    totalBalance: bigint;
    workingHours: TypeOfHour;
    nonWorkingHours: TypeOfHour;
    simpleHours: {
      typeOfHour: TYPES_OF_HOURS;
      value: bigint;
    };
    totalDiscount: bigint;
    balances: TypeOfHoursByYear[];
    balancesSanitized: TypeOfHoursByYearDecimal[];
  }> {
    this.hourlyBalances = hourlyBalances;

    return super
      .calculate({ calculations, year, official, hourlyBalances })
      .then(() => this.calculatePerMonth(hourlyBalances))
      .then(
        ([
          totalBalance,
          workingHours,
          nonWorkingHours,
          simpleHours,
          totalDiscount,
        ]) =>
          this.calculateAccumulateHoursByYear({
            nonWorkingHours,
            simpleHours,
            totalBalance,
            totalDiscount,
            workingHours,
          })
      );
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

  calculateAccumulateHoursByYear({
    nonWorkingHours,
    simpleHours,
    totalBalance,
    totalDiscount,
    workingHours,
  }: {
    totalBalance: bigint;
    workingHours: TypeOfHour;
    nonWorkingHours: TypeOfHour;
    simpleHours: {
      typeOfHour: TYPES_OF_HOURS;
      value: bigint;
    };
    totalDiscount: bigint;
  }) {
    if (this.year === undefined) {
      throw new Error("year must be defined");
    }

    const hoursActualYear = this.currentYearSanitized(
      { workingHours, nonWorkingHours, simpleHours },
      this.year
    );

    const balancesPerYearCalculator = new YearsCalculator();

    return balancesPerYearCalculator
      .calculate({
        hoursActualYear,
        hourlyBalances: this.hourlyBalances,
        totalDiscount,
      })
      .then(
        ({
          calculatedHours: balances,
          calculatedHoursSanitized: balancesSanitized,
        }) => ({
          calculations: this.calculations,
          totalBalance,
          workingHours,
          nonWorkingHours,
          simpleHours,
          totalDiscount,
          balances,
          balancesSanitized,
        })
      );
  }

  getTotalBalance(hourlyBalances: HourlyBalanceTAS[]): Promise<bigint> {
    return new Promise((resolve, reject) => {
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

      let totalBalance = new Decimal(totalHours.toString());
      for (const calculation of this.calculations) {
        const { surplusBusiness, surplusNonWorking, surplusSimple, discount } =
          calculation;

        const hours = this.getTotalHoursPerCalculation({
          surplusBusiness,
          surplusNonWorking,
          surplusSimple,
        });
        totalBalance = totalBalance.add(hours).sub(discount.toString());
      }

      const totalBalanceString = totalBalance.toString();
      logger.debug("total", totalBalanceString, totalBalance);
      const totalBalanceBigInt = BigInt(totalBalanceString);
      return resolve(totalBalanceBigInt);
    });
  }

  getTotalWorkingHours(): Promise<TypeOfHour> {
    const calculationsTAS = calculationTasFromArray(this.calculations);
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
  }

  getTotalNonWorkingHours(): Promise<TypeOfHour> {
    const calculationsTAS = calculationTasFromArray(this.calculations);
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
  }

  getTotalSimpleHours(): Promise<{
    typeOfHour: TYPES_OF_HOURS;
    value: bigint;
  }> {
    const calculationsTAS = calculationTasFromArray(this.calculations);
    const total = calculationsTAS.reduce(
      (total, { surplusSimple }) => total + surplusSimple,
      0n
    );

    return Promise.resolve({
      typeOfHour: HoursClass.simple,
      value: total,
    });
  }

  getTotalDiscount(): Promise<bigint> {
    const calculationsTAS = calculationTasFromArray(this.calculations);
    return Promise.resolve(
      calculationsTAS.reduce((total, { discount }) => total + discount, 0n)
    );
  }

  getTotalHoursPerCalculation({
    surplusBusiness,
    surplusNonWorking,
    surplusSimple,
  }: {
    surplusBusiness: bigint | number | string;
    surplusNonWorking: bigint | number | string;
    surplusSimple: bigint | number | string;
  }): Decimal {
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
  }

  currentYearSanitized(
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
  ): TypeOfHoursByYear {
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

    return {
      year,
      hours: sortedHours,
    };
  }

  selectOptions(): PrismaCalculationFinderOptions {
    return {
      include: {
        calculationTAS: true,
      },
    };
  }
}
