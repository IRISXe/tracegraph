import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { getDashboardData } from "./dashboard.service";

export async function getDashboard(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dashboard = await getDashboardData();

    res.status(200).json({
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
}