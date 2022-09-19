import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTeacher from "entities/CalculationTeacher";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import { TypeOfOfficial } from "enums/officials";
import UnexpectedValueError from "errors/UnexpectedValueError";
import { mikroorm } from "persistence/context/mikroorm/MikroORMDatabase";

import ActualHourlyBalanceBuilder from "./ActualHourlyBalanceBuilder";
import ActualBalanceModel from "./types";

export default class MikroORMActualBalanceBuilder
  implements ActualHourlyBalanceBuilder
{
  create({ type, ...data }: ActualBalanceModel) {
    if (type === TypeOfOfficial.TAS) return this.buildActualBalanceTAS(data);
    if (type === TypeOfOfficial.TEACHER)
      return this.buildActualBalanceTeacher(data);
    throw new UnexpectedValueError("Type not found");
  }

  private buildActualBalanceTAS({
    calculations,
    total,
    year,
    hourlyBalances,
    official,
    id,
    insert = true,
  }: Omit<ActualBalanceModel, "type">) {
    const _calculations = calculations as CalculationTAS[];
    const _hourlyBalances = hourlyBalances as HourlyBalanceTAS[];

    const data = {
      id,
      year,
      total,
      calculations: _calculations,
      official,
      hourlyBalances: _hourlyBalances,
    };

    if (!insert)
      return mikroorm.em.merge<ActualBalanceTAS>(ActualBalanceTAS, data);

    return new ActualBalanceTAS(data);
  }

  private buildActualBalanceTeacher({
    calculations,
    total,
    year,
    hourlyBalances,
    official,
    id,
    insert = true,
  }: Omit<ActualBalanceModel, "type">) {
    const _calculations = calculations as CalculationTeacher[];
    const _hourlyBalances = hourlyBalances as HourlyBalanceTeacher[];

    const data = {
      id,
      year,
      total,
      calculations: _calculations,
      official,
      hourlyBalances: _hourlyBalances,
    };

    if (!insert)
      return mikroorm.em.merge<ActualBalanceTeacher>(
        ActualBalanceTeacher,
        data,
        {
          refresh: true,
        }
      );

    return new ActualBalanceTeacher(data);
  }
}
