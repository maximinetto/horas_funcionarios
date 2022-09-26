import { memoryUsage } from "memory";
import { debug } from "winston";

import buildApp from "./buildApp";
import { configureDotEnv, logger } from "./config";
import DatabaseFactory, {
  TypeOfEngine,
} from "./persistence/context/index.config";

const main = async () => {
  const { OFFICIALS_SCHEDULES_PORT, OFFICIALS_SCHEDULES_HOST } =
    configureDotEnv();
  logger.info("\n\nMemory usage:", {
    ...memoryUsage(),
  });

  const typeOfEngine = process.env
    .OFFICIALS_SCHEDULES_TYPE_OF_ENGINE as TypeOfEngine;

  const database = DatabaseFactory.createDatabase(typeOfEngine || "mikroorm");

  await database.init(true);

  const app = buildApp();

  app.listen(
    {
      port: OFFICIALS_SCHEDULES_PORT,
      host: OFFICIALS_SCHEDULES_HOST,
    },
    (err, address) => {
      if (err) {
        return logger.error(err);
      }

      logger.info(`\n\nServer is listening on ${address}`);
    }
  );

  process.on("SIGTERM", () => {
    debug("SIGTERM signal received: closing HTTP server");
    app.close(() => {
      database.close();
      debug("HTTP server closed");
    });
  });

  process.on("unhandledRejection", (reason) => {
    logger.error(reason);
    throw reason;
  });
};

main();
