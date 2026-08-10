import { Router } from "express";

import {
  getDependencies,
  getService,
  listServices,
} from "./service.controller";

const serviceRouter = Router();

serviceRouter.get("/", listServices);

serviceRouter.get(
  "/:id/dependencies",
  getDependencies,
);

serviceRouter.get("/:id", getService);

export default serviceRouter;