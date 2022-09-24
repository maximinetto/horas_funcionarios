import ActualHourlyBalanceBuilder from "../../creators/actual/ActualHourlyBalanceBuilder";
import ActualBalanceTAS from "../../entities/ActualBalanceTAS";
import ActualBalanceTeacher from "../../entities/ActualBalanceTeacher";
import HourlyBalance from "../../entities/HourlyBalance";
import HourlyBalanceTAS from "../../entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "../../entities/HourlyBalanceTeacher";
import { TypeOfOfficial } from "../../enums/officials";
import UnexpectedValueError from "../../errors/UnexpectedValueError";
import { mikroorm } from "../../persistence/context/mikroorm/MikroORMDatabase";
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
    if (hourlyBalance.type === TypeOfOfficial.TAS)
      return this.createTAS(hourlyBalance as HourlyBalanceTASModel);
    else if (hourlyBalance.type === TypeOfOfficial.TEACHER)
      return this.createTeacher(hourlyBalance as HourlyBalanceTeacherModel);

    throw new UnexpectedValueError("Invalid type of official");
  }

  createTAS({
    insert = true,
    ...hourlyBalanceTAS
  }: HourlyBalanceTASModel): HourlyBalanceTAS {
    const {
      actualBalance: _actualBalance,
      id,
      nonWorking,
      simple,
      working,
      year,
    } = hourlyBalanceTAS;

    let actualBalance: ActualBalanceTAS | undefined;
    if (_actualBalance != null)
      actualBalance = this._actualHourlyBalanceBuilder.create(
        _actualBalance
      ) as ActualBalanceTAS;

    const data = {
      id,
      nonWorking,
      simple,
      working,
      year,
      actualBalance,
    };

    if (!insert)
      return mikroorm.em.merge<HourlyBalanceTAS>(HourlyBalanceTAS, data);

    return new HourlyBalanceTAS(data);
  }

  createTeacher({
    insert = true,
    ...hourlyBalanceTeacher
  }: HourlyBalanceTeacherModel): HourlyBalanceTeacher {
    const {
      actualBalance: _actualBalance,
      id,
      balance,
      year,
    } = hourlyBalanceTeacher;

    let actualBalance: ActualBalanceTeacher | undefined;
    if (_actualBalance != null)
      actualBalance = this._actualHourlyBalanceBuilder.create(
        _actualBalance
      ) as ActualBalanceTeacher;

    const data = {
      id,
      balance,
      year,
      actualBalance,
    };

    if (!insert)
      return mikroorm.em.merge<HourlyBalanceTeacher>(
        HourlyBalanceTeacher,
        data,
        {
          refresh: true,
        }
      );

    return new HourlyBalanceTeacher(data);
  }
}
