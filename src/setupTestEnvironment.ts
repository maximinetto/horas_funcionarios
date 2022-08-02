import buildApp from "app";

export default function setupTestEnvironment() {
  return buildApp({
    logger: {
      level: process.env.LOG_LEVEL || "silent",
    },
    pluginTimeout: 2 * 60 * 1000,
  });
}
