import cors from "cors";
import express from "express";
import router from "routes";
import errorHandler from "validation/middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.use((_req, res) => {
  res.status(404);
  res.send({
    error: "Not found",
  });
});

app.use(errorHandler);
export default app;
