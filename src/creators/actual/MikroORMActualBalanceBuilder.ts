import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTeacher from "entities/CalculationTeacher";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import { TypeOfOfficial } from "enums/officials";
import UnexpectedValueError from "errors/UnexpectedValueError";

import ActualHourlyBalanceBuilder from "./ActualHourlyBalanceBuilder";
import ActualBalanceModel from "./types";

export default class MikroORMActualBalanceBuilder
  implements ActualHourlyBalanceBuilder
{
  create({
    id,
    year,
    total,
    calculations,
    official,
    hourlyBalances,
    type,
  }: ActualBalanceModel) {
    if (type === TypeOfOfficial.TAS) {
      const _calculations = calculations as CalculationTAS[];
      const _hourlyBalances = hourlyBalances as HourlyBalanceTAS[];
      return new ActualBalanceTAS({
        id,
        year,
        total,
        calculations: _calculations,
        official,
        hourlyBalances: _hourlyBalances,
      });
    } else if (type === TypeOfOfficial.TEACHER) {
      const _calculations = calculations as CalculationTeacher[];
      const _hourlyBalances = hourlyBalances as HourlyBalanceTeacher[];
      return new ActualBalanceTeacher({
        id,
        year,
        total,
        calculations: _calculations,
        official,
        hourlyBalances: _hourlyBalances,
      });
    }

    throw new UnexpectedValueError("Type not found");
  }
}
