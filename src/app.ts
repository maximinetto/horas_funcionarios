import routes from "@/routes";
import cors from "cors";
import express from "express";

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

export default app;
