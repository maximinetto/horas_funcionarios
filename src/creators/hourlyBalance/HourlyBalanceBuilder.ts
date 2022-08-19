import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";

import {
  HourlyBalanceModel,
  HourlyBalanceTASModel,
  HourlyBalanceTeacherModel,
} from "./types";

export default interface HourlyBalanceBuilder {
  create(hourlyBalance: HourlyBalanceModel): HourlyBalance;
  createTAS(hourlyBalanceTAS: HourlyBalanceTASModel): HourlyBalanceTAS;
  createTeacher(
    hourlyBalanceTeacher: HourlyBalanceTeacherModel
  ): HourlyBalanceTeacher;
}
