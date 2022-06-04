import { TypeOfHoursByYearDecimal } from "@/@types/typeOfHours";
import ActualBalance from "@/entities/ActualBalance";
import HourlyBalance from "@/entities/HourlyBalance";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import { instance as hours } from "@/services/calculations/classes/typeOfHours";
import Decimal from "decimal.js";

export function convertTypesOfYearsToActualBalance(
  actualBalance: ActualBalance,
  balances: TypeOfHoursByYearDecimal[],
  total: bigint
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

  const { hourlyBalances: h, ...others } = actualBalance;

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
