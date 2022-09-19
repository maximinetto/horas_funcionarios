import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import UnexpectedError from "errors/UnexpectedError";
import MikroORMActualHourlyBalanceRepository from "persistence/ActualBalance/MikroORMActualHourlyBalanceRepository";
import MikroORMCalculationTASRepository from "persistence/Calculation/CalculationTAS/MikroORMCalculationTASRepository";
import MikroORMCalculationTeacherRepository from "persistence/Calculation/CalculationTeacher/MikroORMCalculationTeacherRepository";
import MikroORMCalculationRepository from "persistence/Calculation/MikroORMCalculationRepository";
import MikroORMHourlyBalanceRepository from "persistence/HourlyBalance/MikroORMHourlyBalanceRepository";
import MikroORMHourlyBalanceTASRepository from "persistence/HourlyBalance/MikroORMHourlyBalanceTASRepository";
import MikroORMHourlyBalanceTeacherRepository from "persistence/HourlyBalance/MikroORMHourlyBalanceTeacherRepository";
import MikroORMOfficialRepository from "persistence/Official/MikroORMOfficialRepository";

import Database from "../Database";
import initializeORM from "./index";

export let mikroorm: MikroORM<MySqlDriver>;

export class MikroORMDatabase implements Database {
  protected _mikroorm?: MikroORM<MySqlDriver>;
  calculation!: MikroORMCalculationRepository;
  calculationTAS!: MikroORMCalculationTASRepository;
  calculationTeacher!: MikroORMCalculationTeacherRepository;
  actualBalance!: MikroORMActualHourlyBalanceRepository;
  hourlyBalance!: MikroORMHourlyBalanceRepository;
  hourlyBalanceTAS!: MikroORMHourlyBalanceTASRepository;
  hourlyBalanceTeacher!: MikroORMHourlyBalanceTeacherRepository;
  official!: MikroORMOfficialRepository;

  commit(): Promise<void> {
    this.assert();
    return this._mikroorm.em.flush();
  }

  async init(): Promise<void> {
    this._mikroorm = await initializeORM();
    mikroorm = this._mikroorm;
    this.calculationTAS = new MikroORMCalculationTASRepository();
    this.calculationTeacher = new MikroORMCalculationTeacherRepository();
    this.calculation = new MikroORMCalculationRepository({
      calculationTASRepository: this.calculationTAS,
      calculationTeacherRepository: this.calculationTeacher,
    });
    this.actualBalance = new MikroORMActualHourlyBalanceRepository();
    this.hourlyBalanceTAS = new MikroORMHourlyBalanceTASRepository();
    this.hourlyBalanceTeacher = new MikroORMHourlyBalanceTeacherRepository();

    this.hourlyBalance = new MikroORMHourlyBalanceRepository({
      hourlyBalanceTASRepository: this.hourlyBalanceTAS,
      hourlyBalanceTeacherRepository: this.hourlyBalanceTeacher,
    });
    this.official = new MikroORMOfficialRepository();
  }

  close(): Promise<void> {
    this.assert();
    return this._mikroorm.close();
  }

  clear(): Promise<void> {
    this.assert();
    return this._mikroorm?.getSchemaGenerator().refreshDatabase();
  }

  private assert(): asserts this is this & {
    _mikroorm: MikroORM<MySqlDriver>;
  } {
    if (this._mikroorm == null) {
      throw new UnexpectedError("Database must be initialized");
    }
  }
}
