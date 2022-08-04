import { ConnectionOptions, MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";

const options: ConnectionOptions = {
  clientUrl: process.env.OFFICIALS_SCHEDULES_DB_URL,
};

const mikroorm = MikroORM.init({
  driver: MariaDbDriver,
  timezone: "-03:00",
  ...options,
});

export default mikroorm;
