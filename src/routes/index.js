import fs from "fs/promises";
import path from "path";
import { createRouter } from "../dependencies";
import { baseDir } from "../config";

const router = createRouter();

const pathRouter = path.resolve(baseDir, "routes");

const removeExtension = (file) => {
  return file.split(".")[0];
};

fs.readdir(pathRouter).then((files) => {
  files.forEach((file) => {
    const fileName = removeExtension(file);
    const skip = ["index"].includes(fileName) || file.endsWith("map");
    if (!skip) {
      router.use(`/${fileName}`, require(`./${fileName}`).default);
    }
  });
});

export default router;
