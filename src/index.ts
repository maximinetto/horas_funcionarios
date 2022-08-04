import buildApp from "app";
import { configureDotEnv, logger } from "config";
import { memoryUsage } from "memory";
import Database from "persistence/context/index.config";
import { debug } from "winston";

const main = ({ database }: { database: Database }) => {
  const { OFFICIALS_SCHEDULES_PORT, OFFICIALS_SCHEDULES_HOST } =
    configureDotEnv();
  logger.info("\n\nMemory usage:", {
    ...memoryUsage(),
  });

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

export default main;
