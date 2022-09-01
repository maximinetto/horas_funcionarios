import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import Calculation from "entities/Calculation";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import Official, { TypeOfOfficial } from "entities/Official";
import { TYPES_OF_HOURS } from "enums/typeOfHours";
import { TypeOfHoursByYear } from "types/typeOfHours";
import { generateRandomUUIDV4 } from "utils/strings";

export default class ActualHourlyBalanceCreator {
  private _actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;

  constructor({
    actualHourlyBalanceBuilder,
  }: {
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  }) {
    this._actualHourlyBalanceBuilder = actualHourlyBalanceBuilder;
  }

  create({
    year,
    total,
    officialId,
    balances,
    calculations,
    type,
  }: {
    year: number;
    total: Decimal;
    officialId: number;
    balances: TypeOfHoursByYear[];
    calculations: Calculation[];
    type: TypeOfOfficial;
  }): ActualBalance {
    const actualBalance = this.createActualBalance({
      year,
      total,
      officialId,
      calculations,
      type,
    });

    if (ActualBalanceTAS.isActualBalanceTAS(actualBalance)) {
      const hourlyBalances = this.createHourlyBalancesTAS(
        actualBalance,
        balances,
        year
      );
      actualBalance.setHourlyBalances(hourlyBalances);
    } else if (ActualBalanceTeacher.isActualBalanceTeacher(actualBalance)) {
      const hourlyBalances = this.createHourlyBalancesTeacher(
        actualBalance,
        balances,
        year
      );
      actualBalance.setHourlyBalances(hourlyBalances);
    }

    return actualBalance;
  }

  private createActualBalance({
    total,
    year,
    type,
    officialId,
    calculations,
  }: {
    year: number;
    total: Decimal;
    officialId: number;
    calculations: Calculation[];
    type: TypeOfOfficial;
  }) {
    const id = generateRandomUUIDV4();
    const official = Official.default(officialId);
    return this._actualHourlyBalanceBuilder.create({
      calculations,
      id,
      official,
      total,
      year,
      type,
    });
  }

  private createHourlyBalancesTAS(
    actualBalance: ActualBalanceTAS,
    balances: TypeOfHoursByYear[],
    year: number
  ) {
    return balances.map((b) => {
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
      return new HourlyBalanceTAS({
        id: hourlyBalanceIdTAS,
        year,
        working,
        nonWorking,
        simple,
        actualBalance,
      });
    });
  }

  private createHourlyBalancesTeacher(
    actualBalance: ActualBalanceTeacher,
    balances: TypeOfHoursByYear[],
    year: number
  ) {
    return balances.map((b) => {
      const hourlyBalanceIdTeacher = generateRandomUUIDV4();
      const hour = b.hours[0];
      const balance = new Decimal(hour.value.toString());

      return new HourlyBalanceTeacher({
        id: hourlyBalanceIdTeacher,
        year,
        balance,
        actualBalance,
      });
    });
  }
}
