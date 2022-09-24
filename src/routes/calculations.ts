import { FastifyInstance } from "fastify";

import { createHours } from "../controllers/calculations";
import { schemas } from "../validation/schemas/calculations";

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    "/year/:year/officials/:officialId",
    {
      schema: {
        body: schemas.create,
        params: schemas.paramsCreate,
      },
    },
    createHours
  );
}
