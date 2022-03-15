import { createHours } from "controllers/calculations";
import { createRouter } from "dependencies";
import middleware, { exists } from "validation/middlewares/validation";
import { schemas } from "validation/schemas/calculations";

const entity = "calculation";

const router = createRouter();

const get = function (key, value) {
  const values = value.filter((item) => item[key] !== undefined);
  if (values.length === 0) {
    return false;
  }
  return values.map((v) => v[key]);
};

router.post(
  "/year/:year/officials/:officialId",
  middleware(schemas.create),
  middleware(schemas.year, "params"),
  middleware(schemas.officialId, "params"),
  exists({
    key: "id",
    entity,
    property: "value.calculations",
    find: get,
  }),
  exists({
    key: "officialId",
    relatedKey: "id",
    entity: "official",
    property: "params",
  }),
  createHours
);

export default router;
