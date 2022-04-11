import { asyncHandler } from "dependencies";
import { Request, Response } from "express";
import { calculate } from "services/calculations";
import response from "utils/response";

export const createHours = asyncHandler(async (req: Request, res: Response) => {
  const result = await calculate(res.locals.value);

  response(res, {
    status: 201,
    data: result,
    message: "Calculations done successfully",
  });
});