import dotenv from "dotenv";
import { resolve } from "path";
import util from "util";
import { createLogger, format, transports } from "winston";

import { bigIntSerializator } from "./utils/strings";

export const baseDir = __dirname;

bigIntSerializator();

const combineMessageAndSplat = () => {
  return {
    transform: (info) => {
      // combine message and args if any
      info.message = util.format(
        info.message,
        ...(info[Symbol.for("splat")] || [])
      );
      return info;
    },
  };
};

const configLogger = {
  filename: resolve(baseDir, "..", "logs", "server.log"),
  format: format.combine(
    format.timestamp(),
    combineMessageAndSplat(),
    format.align(),
    format.printf(({ level, message, timestamp, ...metadata }) => {
      let result = `${level}: ${[timestamp]} ${message}`;
      if (metadata) {
        result += `\n${JSON.stringify(metadata, null, 2)}`;
      }

      return result;
    }),
    format.colorize()
  ),
};

export const logger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize(),
    format.timestamp(),
    format.prettyPrint()
  ),
  transports: [new transports.File(configLogger)],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console(configLogger));
}
export function configureDotEnv(env = ".env") {
  const envDir = resolve(baseDir, "..", env);
  logger.info("envDir: ", envDir, "\n\n");

  dotenv.config({
    path: envDir,
  });

  const {
    OFFICIALS_SCHEDULES_PORT = 3000,
    OFFICIALS_SCHEDULES_HOST = "localhost",
    OFFICIALS_SCHEDULES_DB_URL = "mysql://root:@localhost:3306/official_schedules?schema=public",
  } = process.env;

  return {
    OFFICIALS_SCHEDULES_PORT: Number(OFFICIALS_SCHEDULES_PORT),
    OFFICIALS_SCHEDULES_HOST,
    OFFICIALS_SCHEDULES_DB_URL,
  };
}
