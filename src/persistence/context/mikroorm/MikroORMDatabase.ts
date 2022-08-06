import MikroORMActualHourlyBalanceRepository from "persistence/ActualBalance/MikroORMActualHourlyBalanceRepository";
import MikroORMCalculationTASRepository from "persistence/Calculation/CalculationTAS/MikroORMCalculationTASRepository";
import MikroORMCalculationTeacherRepository from "persistence/Calculation/CalculationTeacher/MikroORMCalculationTeacherRepository";
import MikroORMCalculationRepository from "persistence/Calculation/MikroORMCalculationRepository";
import MikroORMHourlyBalanceRepository from "persistence/HourlyBalance/MikroORMHourlyBalanceRepository";
import MikroORMOfficialRepository from "persistence/Official/MikroORMOfficialRepository";

import Database from "../index.config";
import initializeORM, { mikroorm } from "./mikroorm.config";

export class MikroORMDatabase implements Database {
  commit(): Promise<void> {
    return mikroorm.em.flush();
  }

  calculation = new MikroORMCalculationRepository();
  calculationTAS = new MikroORMCalculationTASRepository();
  calculationTeacher = new MikroORMCalculationTeacherRepository();
  actualBalance = new MikroORMActualHourlyBalanceRepository();
  hourlyBalance = new MikroORMHourlyBalanceRepository();
  official = new MikroORMOfficialRepository();

  init(): Promise<void> {
    return initializeORM();
  }

  close(): Promise<void> {
    return mikroorm.close();
  }
}
