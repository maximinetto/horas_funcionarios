import { logger, OFFICIALS_SCHEDULES_PORT } from "config";
import cors from "cors";
import express from "express";
import routes from "routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.use((req, res, next) => {
  res.status(404);
  res.send({
    error: "Not found",
  });
});

app.listen(OFFICIALS_SCHEDULES_PORT, () => {
  logger.info(`Server is listening on port ${OFFICIALS_SCHEDULES_PORT}`);
});

process.on("unhandledRejection", (reason) => {
  logger.error(reason);
  throw reason;
});
