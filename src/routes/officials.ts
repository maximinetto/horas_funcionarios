import { FastifyInstance } from "fastify";

import {
  createOfficials,
  deleteOfficial,
  getOfficials,
  updateOfficial,
} from "../controllers/officials";
import { schemas } from "../validation/schemas/officials";

export default async function routes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        querystring: schemas.id,
      },
    },
    getOfficials
  );
  fastify.post(
    "/",
    {
      schema: {
        body: schemas.create,
      },
    },
    createOfficials
  );
  fastify.put(
    "/:id",
    {
      schema: {
        params: schemas.id,
        body: schemas.update,
      },
    },
    updateOfficial
  );
  fastify.delete(
    "/:id",
    {
      schema: {
        params: schemas.id,
      },
    },
    deleteOfficial
  );
}
