import { Router } from "express";

import { getDashboard } from "./dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.get("/", getDashboard);

export default dashboardRouter;