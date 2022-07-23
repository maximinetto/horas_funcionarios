import fs from "fs/promises";
import path from "path";

import { baseDir, logger } from "config";
import { createRouter } from "dependencies";

const router = createRouter();

const pathRouter = path.resolve(baseDir, "routes");

const removeExtension = (file: string) => {
  return file.split(".")[0];
};

fs.readdir(pathRouter).then((files) => {
  files.forEach((file) => {
    const fileName = removeExtension(file);
    const skip = ["index"].includes(fileName) || file.endsWith("map");
    if (!skip) {
      logger.info(`importing ${fileName}`);
      router.use(`/${fileName}`, require(`./${fileName}`).default);
    }
  });
});

export default router;
