import { Router } from "express";

import { getGraph } from "./graph.controller";

const graphRouter = Router();

graphRouter.get("/", getGraph);

export default graphRouter;