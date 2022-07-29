import {
  createOfficials,
  deleteOfficial,
  getOfficials,
  updateOfficial,
} from "controllers/officials";
import { FastifyInstance } from "fastify";
import { exists } from "validation/middlewares/exists";
import { schemas } from "validation/schemas/officials";

const entity = "official";
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
      preValidation: exists({
        key: "id",
        entity,
        property: "params",
        mustExists: true,
      }),
    },
    updateOfficial
  );
  fastify.delete(
    "/:id",
    {
      schema: {
        params: schemas.id,
      },
      preValidation: exists({
        key: "id",
        entity,
        property: "value",
        mustExists: true,
      }),
    },
    deleteOfficial
  );
}
