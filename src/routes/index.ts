import { baseDir, logger } from "config";
import { FastifyInstance } from "fastify";
import fs from "fs/promises";
import path from "path";

const pathRouter = path.resolve(baseDir, "routes");

const removeExtension = (file: string) => {
  return file.split(".")[0];
};

const routes = (fastify: FastifyInstance) =>
  fs.readdir(pathRouter).then((files) => {
    files.forEach((file) => {
      const fileName = removeExtension(file);
      const skip = ["index"].includes(fileName) || file.endsWith("map");
      if (!skip) {
        logger.info(`importing ${fileName}`);
        fastify.register(import(`./${fileName}`), {
          prefix: `/${fileName}`,
        });
      }
    });
  });

export default routes;
