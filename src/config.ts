import dotenv from "dotenv";
import path from "path";
import util from "util";
import { createLogger, format, transports } from "winston";

export const baseDir = __dirname;

export function configureDotEnv(env = ".env") {
  const envDir = path.resolve(baseDir, "..", env);
  console.log("envDir: ", envDir, "\n\n");

  dotenv.config({
    path: envDir,
  });

  const {
    OFFICIALS_SCHEDULES_PORT = 3000,
    OFFICIALS_SCHEDULES_HOST = "localhost",
    OFFICIALS_SCHEDULES_DB_URL = "mysql://root:@localhost:3306/official_schedules?schema=public",
  } = process.env;

  return {
    OFFICIALS_SCHEDULES_PORT,
    OFFICIALS_SCHEDULES_HOST,
    OFFICIALS_SCHEDULES_DB_URL,
  };
}

const combineMessageAndSplat = () => {
  return {
    transform: (info, opts) => {
      //combine message and args if any
      info.message = util.format(
        info.message,
        ...(info[Symbol.for("splat")] || [])
      );
      return info;
    },
  };
};

const configLogger = {
  filename: path.resolve(baseDir, "logs", "server.log"),
  format: format.combine(
    format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    combineMessageAndSplat(),
    format.align(),
    format.printf(({ level, message, timestamp, ...metadata }) => {
      let result = `${level}: ${[timestamp]} ${message}`;
      if (metadata) {
        result += `\n${JSON.stringify(metadata)}`;
      }

      return result;
    })
  ),
};

export const logger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize(),
    format.timestamp(),
    format.prettyPrint()
  ),
  transports: [
    new transports.File(configLogger),
    new transports.Console(configLogger),
  ],
});
