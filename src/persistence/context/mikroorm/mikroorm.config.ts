import { Options } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";

import { logger } from "../../../config";
import ActualBalanceSchema from "../../../entities/schemas/ActualBalance";
import ActualBalanceTASSchema from "../../../entities/schemas/ActualBalanceTAS";
import ActualBalanceTeacherSchema from "../../../entities/schemas/ActualBalanceTeacher";
import CalculationSchema from "../../../entities/schemas/Calculation";
import CalculationTASSchema from "../../../entities/schemas/CalculationTAS";
import CalculationTeacherSchema from "../../../entities/schemas/CalculationTeacher";
import EntitySchema from "../../../entities/schemas/Entity";
import HourlyBalanceSchema from "../../../entities/schemas/HourlyBalance";
import HourlyBalanceTASSchema from "../../../entities/schemas/HourlyBalanceTAS";
import HourlyBalanceTeacherSchema from "../../../entities/schemas/HourlyBalanceTeacher";
import OfficialSchema from "../../../entities/schemas/Official";

const PORT = Number(process.env.OFFICIALS_SCHEDULES_DB_PORT);

const dbOptions: Options<MySqlDriver> = {
  driver: MySqlDriver,
  timezone: "-03:00",
  entities: [
    ActualBalanceSchema,
    ActualBalanceTASSchema,
    ActualBalanceTeacherSchema,
    CalculationSchema,
    CalculationTASSchema,
    CalculationTeacherSchema,
    HourlyBalanceSchema,
    HourlyBalanceTASSchema,
    HourlyBalanceTeacherSchema,
    EntitySchema,
    OfficialSchema,
  ],
  debug: true,
  allowGlobalContext: true,
  dbName: process.env.OFFICIALS_SCHEDULES_DB_NAME,
  user: process.env.OFFICIALS_SCHEDULES_DB_USER,
  port: PORT,
  password: process.env.OFFICIALS_SCHEDULES_DB_PASSWORD,
  logger: (msg) => logger.log("info", msg),
};

export default dbOptions;
