import { ConnectionOptions, MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";

const options: ConnectionOptions = {
  clientUrl: process.env.OFFICIALS_SCHEDULES_DB_URL,
};

export let mikroorm: MikroORM<MariaDbDriver>;

const initializeORM = async () => {
  const orm = await MikroORM.init({
    driver: MariaDbDriver,
    timezone: "-03:00",
    ...options,
  });

  mikroorm = orm;
};

export default initializeORM;
