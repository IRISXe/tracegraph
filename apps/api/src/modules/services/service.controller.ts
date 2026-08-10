import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  getServiceById,
  getServiceDependencies,
  getServices,
} from "./service.service";


export async function listServices(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const services = await getServices();

    res.status(200).json({
      data: services,
    });
  } catch (error) {
    next(error);
  }
}

export async function getService(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const service = await getServiceById(req.params.id);

    res.status(200).json({
      data: service,
    });
  } catch (error) {
    next(error);
  }
}
export async function getDependencies(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await getServiceDependencies(
      req.params.id,
    );

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}