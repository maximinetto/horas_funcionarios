import express from "express";
import cors from "cors";
import { OFFICIALS_SCHEDULES_PORT } from "config";
import routes from "routes";
import { logger } from "config";

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
