import { MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";
import buildApp from "app";
import { configureDotEnv, logger } from "config";
import { memoryUsage } from "memory";
import { debug } from "winston";

const main = ({ database }: { database: Promise<MikroORM<MariaDbDriver>> }) => {
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
      database.then((orm) => {
        orm.close();
      });
      debug("HTTP server closed");
    });
  });

  process.on("unhandledRejection", (reason) => {
    logger.error(reason);
    throw reason;
  });
};

export default main;
