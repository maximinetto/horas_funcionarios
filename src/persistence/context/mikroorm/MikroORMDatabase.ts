import { MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";
import UnexpectedError from "errors/UnexpectedError";
import MikroORMActualHourlyBalanceRepository from "persistence/ActualBalance/MikroORMActualHourlyBalanceRepository";
import MikroORMCalculationTASRepository from "persistence/Calculation/CalculationTAS/MikroORMCalculationTASRepository";
import MikroORMCalculationTeacherRepository from "persistence/Calculation/CalculationTeacher/MikroORMCalculationTeacherRepository";
import MikroORMCalculationRepository from "persistence/Calculation/MikroORMCalculationRepository";
import MikroORMHourlyBalanceRepository from "persistence/HourlyBalance/MikroORMHourlyBalanceRepository";
import MikroORMOfficialRepository from "persistence/Official/MikroORMOfficialRepository";

import Database from "../index.config";
import initializeORM from "./mikroorm.config";

export let mikroorm: MikroORM<MariaDbDriver>;

export class MikroORMDatabase implements Database {
  protected _mikroorm?: MikroORM<MariaDbDriver>;

  commit(): Promise<void> {
    this.assert();
    return this._mikroorm.em.flush();
  }

  calculationTAS = new MikroORMCalculationTASRepository();
  calculationTeacher = new MikroORMCalculationTeacherRepository();
  calculation = new MikroORMCalculationRepository({
    calculationTASRepository: this.calculationTAS,
  });
  actualBalance = new MikroORMActualHourlyBalanceRepository();
  hourlyBalance = new MikroORMHourlyBalanceRepository();
  official = new MikroORMOfficialRepository();

  async init(): Promise<void> {
    this._mikroorm = await initializeORM();
    mikroorm = this._mikroorm;
  }

  close(): Promise<void> {
    console.log("close");
    this.assert();
    return this._mikroorm.close();
  }

  private assert(): asserts this is this & {
    _mikroorm: MikroORM<MariaDbDriver>;
  } {
    if (this._mikroorm == null) {
      throw new UnexpectedError("Database must be initialized");
    }
  }
}
