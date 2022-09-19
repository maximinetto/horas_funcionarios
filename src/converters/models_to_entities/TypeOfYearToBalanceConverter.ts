import Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTeacher from "entities/CalculationTeacher";
import Official from "entities/Official";
import { TYPES_OF_HOURS } from "enums/typeOfHours";
import UnexpectedValueError from "errors/UnexpectedValueError";
import { instance as hours } from "services/calculations/classes/typeOfHours";
import { TypeOfHoursByYearDecimal } from "types/typeOfHours";

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
    actualBalance.getHourlyBalances().forEach((hourlyBalance) => {
      const current = balances.find((b) => b.year === hourlyBalance.year);

      if (!current) {
        throw new Error("No current balance");
      }

      const simple = new Decimal(
        current.hours
          .find((h) => hours.isFirstTypeOfHour(h.typeOfHour))
          ?.value.toString() ?? "0"
      );
      const working = new Decimal(
        current.hours
          .find((h) => h.typeOfHour === TYPES_OF_HOURS.working)
          ?.value.toString() || "0"
      );
      const nonWorking = new Decimal(
        current.hours
          .find((h) => h.typeOfHour === TYPES_OF_HOURS.nonWorking)
          ?.value.toString() || "0"
      );

      hourlyBalance.working = working;
      hourlyBalance.nonWorking = nonWorking;
      hourlyBalance.simple = simple;
    });

    actualBalance.total = new Decimal(total.toString());
    actualBalance.official = official;
    actualBalance.setCalculations(calculations);

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

    actualBalance.total = total;
    actualBalance.official = official;
    actualBalance.setCalculations(calculations);

    return actualBalance;
  }
}
