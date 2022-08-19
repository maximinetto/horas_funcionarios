import Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import { TYPES_OF_HOURS } from "enums/typeOfHours";
import UnexpectedValueError from "errors/UnexpectedValueError";
import { instance as hours } from "services/calculations/classes/typeOfHours";
import { TypeOfHoursByYearDecimal } from "types/typeOfHours";

export function convertTypesOfYearsToActualBalance(
  actualBalance: ActualBalance,
  balances: TypeOfHoursByYearDecimal[],
  total: Decimal
): ActualBalance {
  if (actualBalance instanceof ActualBalanceTAS) {
    return convertToActualBalanceTAS(actualBalance, balances, total);
  } else if (actualBalance instanceof ActualBalanceTeacher) {
    return convertToActualBalanceTeacher(actualBalance, balances, total);
  }

  throw new UnexpectedValueError("Type not found");
}

function convertToActualBalanceTAS(
  actualBalance: ActualBalanceTAS,
  balances: TypeOfHoursByYearDecimal[],
  total: Decimal
) {
  const hourlyBalances = actualBalance.hourlyBalances
    .getItems()
    .map((hourlyBalance) => {
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
      return new HourlyBalanceTAS({
        id: hourlyBalance.id,
        year: hourlyBalance.year,
        working,
        nonWorking,
        simple,
      });
    });

  return new ActualBalanceTAS({
    id: actualBalance.id,
    year: actualBalance.year,
    total: new Decimal(total.toString()),
    official: actualBalance.official,
    hourlyBalances,
  });
}

function convertToActualBalanceTeacher(
  actualBalance: ActualBalanceTeacher,
  balances: TypeOfHoursByYearDecimal[],
  total: Decimal
) {
  const hourlyBalances = actualBalance.hourlyBalances
    .getItems()
    .map((hourlyBalance) => {
      const current = balances.find((b) => b.year === hourlyBalance.year);

      if (!current) {
        throw new Error("No current balance");
      }
      const balance = new Decimal(current.hours[0]?.value.toString() ?? "0");
      return new HourlyBalanceTeacher({
        id: hourlyBalance.id,
        year: hourlyBalance.year,
        balance,
      });
    });

  return new ActualBalanceTeacher({
    id: actualBalance.id,
    year: actualBalance.year,
    total: new Decimal(total.toString()),
    official: actualBalance.official,
    hourlyBalances,
  });
}
