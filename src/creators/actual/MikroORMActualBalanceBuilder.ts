import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTeacher from "entities/CalculationTeacher";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import UnexpectedValueError from "errors/UnexpectedValueError";
import { mikroorm } from "persistence/context/mikroorm/MikroORMDatabase";

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
    if (type === "tas") {
      const _calculations = calculations as CalculationTAS[];
      const _hourlyBalances = hourlyBalances as HourlyBalanceTAS[];
      return mikroorm.em.create(ActualBalanceTAS, {
        id,
        year,
        total,
        calculations: _calculations,
        official,
        hourlyBalances: _hourlyBalances,
        type: "tas",
      });
    } else if (type === "teacher") {
      const _calculations = calculations as CalculationTeacher[];
      const _hourlyBalances = hourlyBalances as HourlyBalanceTeacher[];
      return mikroorm.em.create(ActualBalanceTeacher, {
        id,
        year,
        total,
        calculations: _calculations,
        official,
        hourlyBalances: _hourlyBalances,
        type: "teacher",
      });
    }

    throw new UnexpectedValueError("Type not found");
  }
}
