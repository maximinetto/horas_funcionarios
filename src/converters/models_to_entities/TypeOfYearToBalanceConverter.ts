import Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import { TYPES_OF_HOURS } from "enums/typeOfHours";
import { instance as hours } from "services/calculations/classes/typeOfHours";
import { TypeOfHoursByYearDecimal } from "types/typeOfHours";

export function convertTypesOfYearsToActualBalance(
  actualBalance: ActualBalance,
  balances: TypeOfHoursByYearDecimal[],
  total: Decimal
): ActualBalance {
  const hourlyBalances = actualBalance.hourlyBalances.map((hourlyBalance) => {
    const current = balances.find((b) => b.year === hourlyBalance.year);

    if (!current) {
      throw new Error("No current balance");
    }

    if (isTASEntity(hourlyBalance)) {
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
      return new HourlyBalanceTAS(
        hourlyBalance.id,
        hourlyBalance.year,
        working,
        nonWorking,
        simple,
        hourlyBalance.hourlyBalanceId
      );
    } else if (isTeacherEntity(hourlyBalance)) {
      const balance = new Decimal(current.hours[0]?.value.toString() ?? "0");
      return new HourlyBalanceTeacher(
        hourlyBalance.id,
        hourlyBalance.year,
        balance,
        hourlyBalance.hourlyBalanceId
      );
    } else {
      throw new Error("Unknown entity");
    }
  });

  return new ActualBalance(
    actualBalance.id,
    actualBalance.year,
    new Decimal(total.toString()),
    actualBalance.official.orUndefined(),
    hourlyBalances
  );
}

function isTASEntity(entity: HourlyBalance): entity is HourlyBalanceTAS {
  return entity instanceof HourlyBalanceTAS;
}

function isTeacherEntity(entity: HourlyBalance): entity is HourlyBalanceTAS {
  return entity instanceof HourlyBalanceTAS;
}
