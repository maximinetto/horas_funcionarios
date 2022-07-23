import {
  createOfficials,
  deleteOfficial,
  getOfficials,
  updateOfficial,
} from "controllers/officials";
import { createRouter } from "dependencies";
import middleware, { exists } from "validation/middlewares/validation";
import { schemas } from "validation/schemas/officials";

const entity = "official";

const router = createRouter();

router.get("/", middleware(schemas.get, "query"), getOfficials);
router.post("/", middleware(schemas.create), createOfficials);
router.put(
  "/:id",
  middleware(schemas.id, "params"),
  exists({ key: "id", entity, property: "value", mustExists: true }),
  middleware(schemas.update, "body"),
  updateOfficial
);
router.delete(
  "/:id",
  middleware(schemas.id, "params"),
  exists({ key: "id", entity, property: "value", mustExists: true }),
  deleteOfficial
);

export default router;
