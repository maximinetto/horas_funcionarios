import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import UnexpectedValueError from "errors/UnexpectedValueError";

import HourlyBalanceBuilder from "./HourlyBalanceBuilder";
import {
  HourlyBalanceModel,
  HourlyBalanceTASModel,
  HourlyBalanceTeacherModel,
} from "./types";

export default class MikroORMHourlyBalanceBuilder
  implements HourlyBalanceBuilder
{
  private _actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;

  constructor({
    actualHourlyBalanceBuilder,
  }: {
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  }) {
    this._actualHourlyBalanceBuilder = actualHourlyBalanceBuilder;
  }

  create(hourlyBalance: HourlyBalanceModel): HourlyBalance {
    if (hourlyBalance.type === "tas")
      return this.createTAS(hourlyBalance as HourlyBalanceTASModel);
    else if (hourlyBalance.type === "teacher")
      return this.createTeacher(hourlyBalance as HourlyBalanceTeacherModel);

    throw new UnexpectedValueError("Invalid type of official");
  }

  createTAS(hourlyBalanceTAS: HourlyBalanceTASModel): HourlyBalanceTAS {
    const {
      actualBalance: _actualBalance,
      id,
      nonWorking,
      simple,
      working,
      year,
    } = hourlyBalanceTAS;

    let actualBalance: ActualBalanceTAS | undefined;
    if (actualBalance != null)
      actualBalance = this._actualHourlyBalanceBuilder.create(
        _actualBalance
      ) as ActualBalanceTAS;

    return new HourlyBalanceTAS({
      id,
      nonWorking,
      simple,
      working,
      year,
      actualBalance,
    });
  }

  createTeacher(
    hourlyBalanceTeacher: HourlyBalanceTeacherModel
  ): HourlyBalanceTeacher {
    const {
      actualBalance: _actualBalance,
      id,
      balance,
      year,
    } = hourlyBalanceTeacher;

    let actualBalance: ActualBalanceTeacher | undefined;
    if (actualBalance != null)
      actualBalance = this._actualHourlyBalanceBuilder.create(
        _actualBalance
      ) as ActualBalanceTeacher;

    return new HourlyBalanceTeacher({
      id,
      balance,
      year,
      actualBalance,
    });
  }
}
