import { createHours } from "controllers/calculations";
import { FastifyInstance } from "fastify";
import { exists } from "validation/middlewares/exists";
import { schemas } from "validation/schemas/calculations";

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    "/year/:year/officials/:officialId",
    {
      schema: {
        body: schemas.create,
        params: schemas.paramsCreate,
      },
      preValidation: exists({
        key: "officialId",
        relatedKey: "id",
        entity: "official",
        property: "params",
        mustExists: true,
      }),
    },
    createHours
  );
}
