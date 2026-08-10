import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  getGraphTopology,
} from "./graph.service";

export async function getGraph(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const graph = await getGraphTopology();

    res.status(200).json({
      data: graph,
    });
  } catch (error) {
    next(error);
  }
}