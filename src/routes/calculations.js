import { createHours } from "controllers/calculations";
import { router } from "dependencies";
import middleware, { exists } from "validation/middlewares/validation";

const entity = "official";

router.post("/", middleware(schemas.create), createHours);
