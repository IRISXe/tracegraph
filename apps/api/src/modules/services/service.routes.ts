import { Router } from "express";

import {
  getBlastRadius,
  getDependencies,
  getDependents,
  getOwner,
  getService,
  listServices,
} from "./service.controller";

const serviceRouter = Router();

serviceRouter.get("/", listServices);

serviceRouter.get(
  "/:id/dependencies",
  getDependencies,
);

serviceRouter.get(
  "/:id/dependents",
  getDependents,
);

serviceRouter.get(
  "/:id/owner",
  getOwner,
);

serviceRouter.get(
  "/:id/blast-radius",
  getBlastRadius,
);

serviceRouter.get("/:id", getService);

export default serviceRouter;