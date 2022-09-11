import { MikroORM } from "@mikro-orm/core";

import dbOptions from "./mikroorm.config";

const initializeORM = async () => {
  console.log("orm init", process.env.OFFICIALS_SCHEDULES_DB_URL);
  return MikroORM.init(dbOptions);
};

export default initializeORM;