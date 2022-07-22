import { createHours } from "@/controllers/calculations";
import { createRouter } from "@/dependencies";
import middleware, { exists } from "@/validation/middlewares/validation";
import { schemas } from "@/validation/schemas/calculations";

const router = createRouter();

router.post(
  "/year/:year/officials/:officialId",
  middleware(schemas.create),
  middleware(schemas.paramsCreate, "params"),
  exists({
    key: "officialId",
    relatedKey: "id",
    entity: "official",
    property: "params",
    mustExists: true,
  }),
  createHours
);

export default router;
