import { Router } from "express";

import {
  getIncident,
  listIncidents,
} from "./incident.controller";

const incidentRouter = Router();

incidentRouter.get("/", listIncidents);

incidentRouter.get("/:id", getIncident);

export default incidentRouter;