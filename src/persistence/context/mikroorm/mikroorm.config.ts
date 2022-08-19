import { ConnectionOptions, MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";
import ActualBalanceSchema from "entities/schemas/ActualBalance";
import ActualBalanceTASSchema from "entities/schemas/ActualBalanceTAS";
import ActualBalanceTeacherSchema from "entities/schemas/ActualBalanceTeacher";
import CalculationSchema from "entities/schemas/Calculation";
import CalculationTASSchema from "entities/schemas/CalculationTAS";
import CalculationTeacherSchema from "entities/schemas/CalculationTeacher";
import EntitySchema from "entities/schemas/Entity";
import HourlyBalanceSchema from "entities/schemas/HourlyBalance";
import HourlyBalanceTASSchema from "entities/schemas/HourlyBalanceTAS";
import HourlyBalanceTeacherSchema from "entities/schemas/HourlyBalanceTeacher";
import OfficialSchema from "entities/schemas/Official";

const options: ConnectionOptions = {
  clientUrl: process.env.OFFICIALS_SCHEDULES_DB_URL,
};

const initializeORM = async () => {
  console.log("orm init");
  return MikroORM.init({
    driver: MariaDbDriver,
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
    ...options,
  });
};

export default initializeORM;
