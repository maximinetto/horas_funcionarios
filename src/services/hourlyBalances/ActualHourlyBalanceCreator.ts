import Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import Calculation from "entities/Calculation";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import Official from "entities/Official";
import { TYPES_OF_HOURS } from "enums/typeOfHours";
import { TypeOfHoursByYear } from "types/typeOfHours";
import { generateRandomUUIDV4 } from "utils/strings";

export default class ActualHourlyBalanceCreator {
  create({
    year,
    total,
    officialId,
    balances,
    calculations,
  }: {
    year: number;
    total: Decimal;
    officialId: number;
    balances: TypeOfHoursByYear[];
    calculations: Calculation[];
  }): ActualBalance {
    const id = generateRandomUUIDV4();

    const actualBalance = new ActualBalance(
      id,
      year,
      total,
      Official.default(officialId)
    );

    const hourlyBalances = balances.map((b) => {
      const hourlyBalanceId = generateRandomUUIDV4();
      const hourlyBalanceIdTAS = generateRandomUUIDV4();
      const simple = new Decimal(
        b.hours
          .find((h) => h.typeOfHour === TYPES_OF_HOURS.simple)
          ?.value.toString() ?? "0"
      );
      const working = new Decimal(
        b.hours
          .find((h) => h.typeOfHour === TYPES_OF_HOURS.working)
          ?.value.toString() || "0"
      );
      const nonWorking = new Decimal(
        b.hours
          .find((h) => h.typeOfHour === TYPES_OF_HOURS.nonWorking)
          ?.value.toString() || "0"
      );
      return new HourlyBalanceTAS(
        hourlyBalanceId,
        year,
        working,
        nonWorking,
        simple,
        hourlyBalanceIdTAS,
        actualBalance
      );
    });

    actualBalance.hourlyBalances = hourlyBalances;
    actualBalance.calculations = calculations;

    return actualBalance;
  }
}
