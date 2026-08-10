import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  getIncidentById,
  getIncidents,
} from "./incident.service";

export async function listIncidents(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const incidents = await getIncidents();

    res.status(200).json({
      data: incidents,
    });
  } catch (error) {
    next(error);
  }
}

export async function getIncident(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const incident = await getIncidentById(
      req.params.id,
    );

    res.status(200).json({
      data: incident,
    });
  } catch (error) {
    next(error);
  }
}