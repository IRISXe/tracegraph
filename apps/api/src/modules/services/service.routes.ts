import { Router } from "express";

import {
  getService,
  listServices,
} from "./service.controller";

const serviceRouter = Router();

serviceRouter.get("/", listServices);

serviceRouter.get("/:id", getService);

export default serviceRouter;