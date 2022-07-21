import cors from "cors";
import express from "express";

import routes from "@/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.use((_req, res) => {
  res.status(404);
  res.send({
    error: "Not found",
  });
});
export default app;
