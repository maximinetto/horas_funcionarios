import { logger } from "config";
import { asyncHandler } from "dependencies";
import { calculator } from "dependencies/container";
import { Request, Response } from "express";
import response from "utils/response";

export const createHours = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await calculator.execute(res.locals.value);
    logger.info("calculations", result.currentYear.calculations);
    response(res, {
      status: 201,
      data: result,
      message: "Calculations done successfully",
    });
  }
);
