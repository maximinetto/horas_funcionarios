import { logger, OFFICIALS_SCHEDULES_PORT, configureDotEnv } from "@/config";
import app from "@/app";

configureDotEnv();

app.listen(OFFICIALS_SCHEDULES_PORT, () => {
  logger.info(`Server is listening on port ${OFFICIALS_SCHEDULES_PORT}`);
});

process.on("unhandledRejection", (reason) => {
  logger.error(reason);
  throw reason;
});

const resolveRoutes = (stack) => {
  return stack
    .map(function (layer) {
      if (layer.route && layer.route.path.isString()) {
        let methods = Object.keys(layer.route.methods);
        if (methods.length > 20) methods = ["ALL"];

        return { methods: methods, path: layer.route.path };
      }

      if (layer.name === "router")
        // router middleware
        return resolveRoutes(layer.handle.stack);
    })
    .filter((route) => route);
};

const paths = resolveRoutes(app._router.stack);
const printRoute = (route) => {
  if (Array.isArray(route)) return route.forEach((route) => printRoute(route));

  logger.info(JSON.stringify(route.methods) + " " + route.path);
};

printRoute(paths);
