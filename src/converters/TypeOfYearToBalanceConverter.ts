import Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import { TYPES_OF_HOURS } from "enums/typeOfHours";
import { instance as hours } from "services/calculations/classes/typeOfHours";
import { TypeOfHoursByYearDecimal } from "types/typeOfHours";

export function convertTypesOfYearsToActualBalance(
  actualBalance: ActualBalance,
  balances: TypeOfHoursByYearDecimal[],
  total: Decimal
): ActualBalance {
  const hourlyBalances = actualBalance.hourlyBalances.map((h) => {
    const current = balances.find((b) => b.year === h.year);

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

    if (isTASEntity(h)) {
      return new HourlyBalanceTAS(
        h.id,
        h.year,
        working,
        nonWorking,
        simple,
        h.hourlyBalanceId
      );
    } else if (isTeacherEntity(h)) {
      return new HourlyBalanceTAS(
        h.id,
        h.year,
        working,
        nonWorking,
        simple,
        h.hourlyBalanceId
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
