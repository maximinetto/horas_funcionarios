import Decimal from "decimal.js";

import ActualHourlyBalanceBuilder from "../../creators/actual/ActualHourlyBalanceBuilder";
import HourlyBalanceBuilder from "../../creators/hourlyBalance/HourlyBalanceBuilder";
import ActualBalance from "../../entities/ActualBalance";
import ActualBalanceTAS from "../../entities/ActualBalanceTAS";
import ActualBalanceTeacher from "../../entities/ActualBalanceTeacher";
import Calculation from "../../entities/Calculation";
import HourlyBalance from "../../entities/HourlyBalance";
import Official from "../../entities/Official";
import { TypeOfOfficial } from "../../enums/officials";
import { TYPES_OF_HOURS } from "../../enums/typeOfHours";
import UnexpectedValueError from "../../errors/UnexpectedValueError";
import { TypeOfHoursByYear } from "../../types/typeOfHours";
import { generateRandomUUIDV4 } from "../../utils/strings";
import { removeHourlyBalancesWithZeroBalance } from "./HourlyBalanceRemover";

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

    let hourlyBalances: HourlyBalance[];
    if (ActualBalanceTAS.isActualBalanceTAS(actualBalance)) {
      hourlyBalances = this.createHourlyBalancesTAS(balances);
    } else if (ActualBalanceTeacher.isActualBalanceTeacher(actualBalance)) {
      hourlyBalances = this.createHourlyBalancesTeacher(balances);
    } else {
      throw new UnexpectedValueError("Type of hourly balance invalid");
    }

    const result = actualBalance as ActualBalance;

    hourlyBalances = removeHourlyBalancesWithZeroBalance(hourlyBalances);

    result.setHourlyBalances(hourlyBalances);

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
  }): ActualBalance {
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

  private createHourlyBalancesTAS(balances: TypeOfHoursByYear[]) {
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
        year: b.year,
        working,
        nonWorking,
        simple,
        insert: true,
        type: TypeOfOfficial.TAS,
      });
    });
  }

  private createHourlyBalancesTeacher(balances: TypeOfHoursByYear[]) {
    return balances.map((b) => {
      const hourlyBalanceIdTeacher = generateRandomUUIDV4();
      const hour = b.hours[0];
      const balance = new Decimal(hour.value.toString());

      return this._hourlyBalanceBuilder.createTeacher({
        id: hourlyBalanceIdTeacher,
        year: b.year,
        balance,
        insert: true,
        type: TypeOfOfficial.TEACHER,
      });
    });
  }
}
