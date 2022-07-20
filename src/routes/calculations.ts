import Calculations from "@/collections/Calculations";
import { createHours } from "@/controllers/calculations";
import { createRouter } from "@/dependencies";
import { calculate } from "@/services/calculations";
import { calculationsFirstTest } from "@/services/calculations/classes/tests/HoursTASCalculator/initialValues";
import middleware, { exists } from "@/validation/middlewares/validation";
import { schemas } from "@/validation/schemas/calculations";

const entity = "calculation";

const router = createRouter();

const get = function (key: string, value: any[]) {
  const values = value.filter((item) => item[key] !== undefined);
  if (values.length === 0) {
    return false;
  }
  return values.map((v) => v[key]);
};

router.get("/", async (req, res) => {
  const result = await calculate({
    calculations: new Calculations(...calculationsFirstTest),
    officialId: 1,
    year: 2022,
  });

  res.json({
    result: {
      ...result,
      ...result.actualHourlyBalances.map((a) => a.toJSON()),
    },
  });
});

router.post(
  "/year/:year/officials/:officialId",
  middleware(schemas.create),
  middleware(schemas.paramsCreate, "params"),
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
