import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";

import { logger } from "../../../config";
import UnexpectedError from "../../../errors/UnexpectedError";
import MikroORMActualHourlyBalanceRepository from "../../ActualBalance/MikroORMActualHourlyBalanceRepository";
import MikroORMCalculationTASRepository from "../../Calculation/CalculationTAS/MikroORMCalculationTASRepository";
import MikroORMCalculationTeacherRepository from "../../Calculation/CalculationTeacher/MikroORMCalculationTeacherRepository";
import MikroORMCalculationRepository from "../../Calculation/MikroORMCalculationRepository";
import MikroORMHourlyBalanceRepository from "../../HourlyBalance/MikroORMHourlyBalanceRepository";
import MikroORMHourlyBalanceTASRepository from "../../HourlyBalance/MikroORMHourlyBalanceTASRepository";
import MikroORMHourlyBalanceTeacherRepository from "../../HourlyBalance/MikroORMHourlyBalanceTeacherRepository";
import MikroORMOfficialRepository from "../../Official/MikroORMOfficialRepository";
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
    try {
      this.assert();
      return this._mikroorm.em.flush();
    } catch (err) {
      logger.error(err);
      throw new UnexpectedError("Something was wrong");
    }
  }

  async init(connect = true): Promise<void> {
    this._mikroorm = await initializeORM(connect);
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
