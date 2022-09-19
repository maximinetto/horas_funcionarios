import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import HourlyBalanceBuilder from "creators/hourlyBalance/HourlyBalanceBuilder";
import Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import Calculation from "entities/Calculation";
import Official from "entities/Official";
import { TypeOfOfficial } from "enums/officials";
import { TYPES_OF_HOURS } from "enums/typeOfHours";
import { TypeOfHoursByYear } from "types/typeOfHours";
import { generateRandomUUIDV4 } from "utils/strings";

export default class ActualHourlyBalanceCreator {
  private _actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  private _hourlyBalanceBuilder: HourlyBalanceBuilder;

  constructor({
    actualHourlyBalanceBuilder,
    hourlyBalanceBuilder,
  }: {
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
    hourlyBalanceBuilder: HourlyBalanceBuilder;
  }) {
    this._actualHourlyBalanceBuilder = actualHourlyBalanceBuilder;
    this._hourlyBalanceBuilder = hourlyBalanceBuilder;
  }

  create({
    year,
    total,
    official,
    balances,
    calculations,
    type,
  }: {
    year: number;
    total: Decimal;
    official: Official;
    balances: TypeOfHoursByYear[];
    calculations: Calculation[];
    type: TypeOfOfficial;
  }): ActualBalance {
    const actualBalance = this.createActualBalance({
      year,
      total,
      official,
      calculations,
      type,
    });

    if (ActualBalanceTAS.isActualBalanceTAS(actualBalance)) {
      const hourlyBalances = this.createHourlyBalancesTAS(balances, year);
      actualBalance.setHourlyBalances(hourlyBalances);
    } else if (ActualBalanceTeacher.isActualBalanceTeacher(actualBalance)) {
      const hourlyBalances = this.createHourlyBalancesTeacher(balances, year);
      actualBalance.setHourlyBalances(hourlyBalances);
    }

    return actualBalance;
  }

  private createActualBalance({
    total,
    year,
    type,
    official,
    calculations,
  }: {
    year: number;
    total: Decimal;
    official: Official;
    calculations: Calculation[];
    type: TypeOfOfficial;
  }) {
    const id = generateRandomUUIDV4();
    return this._actualHourlyBalanceBuilder.create({
      calculations,
      id,
      official,
      total,
      year,
      type,
      insert: true,
    });
  }

  private createHourlyBalancesTAS(balances: TypeOfHoursByYear[], year: number) {
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

      return this._hourlyBalanceBuilder.createTAS({
        id: hourlyBalanceIdTAS,
        year,
        working,
        nonWorking,
        simple,
        insert: true,
        type: TypeOfOfficial.TAS,
      });
    });
  }

  private createHourlyBalancesTeacher(
    balances: TypeOfHoursByYear[],
    year: number
  ) {
    return balances.map((b) => {
      const hourlyBalanceIdTeacher = generateRandomUUIDV4();
      const hour = b.hours[0];
      const balance = new Decimal(hour.value.toString());

      return this._hourlyBalanceBuilder.createTeacher({
        id: hourlyBalanceIdTeacher,
        year,
        balance,
        insert: true,
        type: TypeOfOfficial.TEACHER,
      });
    });
  }
}
