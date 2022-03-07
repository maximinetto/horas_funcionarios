import {
  getOfficials,
  createOfficials,
  updateOfficial,
  deleteOfficial,
} from "controllers/officials";
import { router } from "dependencies";
import { schemas } from "validation/schemas/officials/get";
import middleware, { exists } from "validation/middlewares/validation";

const entity = "official";

router.get("/", getOfficials);
router.post("/", middleware(schemas.create), createOfficials);
router.put(
  "/:id",
  middleware(schemas.id, "params"),
  exists({ key: "id", entity, property: "value" }),
  middleware(schemas.update, "body"),
  updateOfficial
);
router.delete(
  "/:id",
  middleware(schemas.id, "params"),
  exists({ key: "id", entity, property: "value" }),
  deleteOfficial
);

export default router;
