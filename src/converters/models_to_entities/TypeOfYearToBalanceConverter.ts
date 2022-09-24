import Decimal from "decimal.js";

import ActualBalance from "../../entities/ActualBalance";
import ActualBalanceTAS from "../../entities/ActualBalanceTAS";
import ActualBalanceTeacher from "../../entities/ActualBalanceTeacher";
import Calculation from "../../entities/Calculation";
import CalculationTAS from "../../entities/CalculationTAS";
import CalculationTeacher from "../../entities/CalculationTeacher";
import HourlyBalanceTAS from "../../entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "../../entities/HourlyBalanceTeacher";
import Official from "../../entities/Official";
import { TYPES_OF_HOURS } from "../../enums/typeOfHours";
import UnexpectedValueError from "../../errors/UnexpectedValueError";
import { instance as hours } from "../../services/calculations/classes/typeOfHours";
import { removeHourlyBalancesWithZeroBalance } from "../../services/hourlyBalances/HourlyBalanceRemover";
import sort from "../../services/hourlyBalances/HourlyBalancesSorter";
import { TypeOfHoursByYearDecimal } from "../../types/typeOfHours";
import { generateRandomUUIDV4 } from "../../utils/strings";

export default class TypeOfYearToBalanceConverter {
  convertToActualBalance({
    actualBalance,
    balances,
    calculations,
    total,
    official,
  }: {
    actualBalance: ActualBalance;
    balances: TypeOfHoursByYearDecimal[];
    total: Decimal;
    calculations: Calculation[];
    official: Official;
  }): ActualBalance {
    if (actualBalance instanceof ActualBalanceTAS) {
      return this.convertToActualBalanceTAS({
        actualBalance,
        balances,
        total,
        calculations: calculations as CalculationTAS[],
        official,
      });
    } else if (actualBalance instanceof ActualBalanceTeacher) {
      return this.convertToActualBalanceTeacher({
        actualBalance,
        balances,
        total,
        calculations: calculations as CalculationTeacher[],
        official,
      });
    }

    throw new UnexpectedValueError("Type not found");
  }

  private convertToActualBalanceTAS({
    actualBalance,
    balances,
    total,
    calculations,
    official,
  }: {
    actualBalance: ActualBalanceTAS;
    balances: TypeOfHoursByYearDecimal[];
    total: Decimal;
    calculations: CalculationTAS[];
    official: Official;
  }) {
    balances.forEach((balance) => {
      let current = actualBalance
        .getHourlyBalances()
        .find((b) => b.year === balance.year);

      const simple = new Decimal(
        balance.hours
          .find((h) => hours.isFirstTypeOfHour(h.typeOfHour))
          ?.value.toString() ?? "0"
      );
      const working = new Decimal(
        balance.hours
          .find((h) => h.typeOfHour === TYPES_OF_HOURS.working)
          ?.value.toString() || "0"
      );
      const nonWorking = new Decimal(
        balance.hours
          .find((h) => h.typeOfHour === TYPES_OF_HOURS.nonWorking)
          ?.value.toString() || "0"
      );

      if (!current) {
        current = new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          working,
          nonWorking,
          simple,
          year: balance.year,
          actualBalance,
        });
        actualBalance.addHourlyBalance(current);
      } else {
        current.working = working;
        current.nonWorking = nonWorking;
        current.simple = simple;
      }
    });

    this.assignValues({
      actualBalance,
      balances,
      calculations,
      official,
      total,
    });

    return actualBalance;
  }

  private convertToActualBalanceTeacher({
    actualBalance,
    balances,
    calculations,
    total,
    official,
  }: {
    actualBalance: ActualBalanceTeacher;
    balances: TypeOfHoursByYearDecimal[];
    total: Decimal;
    calculations: CalculationTeacher[];
    official: Official;
  }) {
    actualBalance.getHourlyBalances().forEach((hourlyBalance) => {
      const current = balances.find((b) => b.year === hourlyBalance.year);

      if (!current) {
        throw new Error("No current balance");
      }
      const balance = new Decimal(current.hours[0]?.value.toString() ?? "0");
      hourlyBalance.balance = balance;
    });

    balances.forEach((balance) => {
      let current = actualBalance
        .getHourlyBalances()
        .find((b) => b.year === balance.year);

      const hours = new Decimal(balance.hours[0]?.value.toString() ?? "0");

      if (!current) {
        current = new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: hours,
          year: balance.year,
          actualBalance,
        });
        actualBalance.addHourlyBalance(current);
      } else {
        current.balance = hours;
      }
    });

    this.assignValues({
      actualBalance,
      balances,
      calculations,
      official,
      total,
    });

    return actualBalance;
  }

  private assignValues({
    actualBalance,
    calculations,
    official,
    balances,
    total,
  }: {
    actualBalance: ActualBalance;
    balances: TypeOfHoursByYearDecimal[];
    total: Decimal;
    official: Official;
    calculations: Calculation[];
  }) {
    const hourlyBalancesToRemove = actualBalance
      .getHourlyBalances()
      .filter((h) => !balances.some((b) => b.year === h.year));

    actualBalance.removeHourlyBalance(...hourlyBalancesToRemove);

    let hourlyBalances = actualBalance.getHourlyBalances();
    hourlyBalances = sort(hourlyBalances);
    hourlyBalances = removeHourlyBalancesWithZeroBalance(hourlyBalances);
    actualBalance.setHourlyBalances(hourlyBalances);

    actualBalance.total = total;
    actualBalance.official = official;
    actualBalance.setCalculations(calculations);
  }
}
