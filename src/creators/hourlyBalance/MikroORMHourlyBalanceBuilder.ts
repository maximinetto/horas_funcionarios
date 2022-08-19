import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import UnexpectedValueError from "errors/UnexpectedValueError";
import { mikroorm } from "persistence/context/mikroorm/MikroORMDatabase";

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
    let { actualBalance, id, nonWorking, simple, working, year } =
      hourlyBalanceTAS;

    if (actualBalance != null)
      actualBalance = this._actualHourlyBalanceBuilder.create(actualBalance);

    return mikroorm.em.create(HourlyBalanceTAS, {
      id,
      nonWorking,
      simple,
      working,
      year,
      actualBalance,
      createdAt: hourlyBalanceTAS.createdAt,
      updatedAt: hourlyBalanceTAS.updatedAt,
    });
  }

  createTeacher(
    hourlyBalanceTeacher: HourlyBalanceTeacherModel
  ): HourlyBalanceTeacher {
    let { actualBalance, id, balance, year } = hourlyBalanceTeacher;

    if (actualBalance != null)
      actualBalance = this._actualHourlyBalanceBuilder.create(actualBalance);

    return mikroorm.em.create(HourlyBalanceTeacher, {
      id,
      balance,
      year,
      actualBalance,
      createdAt: hourlyBalanceTeacher.createdAt,
      updatedAt: hourlyBalanceTeacher.updatedAt,
    });
  }
}
