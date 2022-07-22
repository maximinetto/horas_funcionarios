import { Request, Response } from "express";

import { asyncHandler } from "@/dependencies";
import { calculator } from "@/dependencies/container";
import response from "@/utils/response";

export const createHours = asyncHandler(async (req: Request, res: Response) => {
  const result = await calculator.execute(res.locals.value);

  response(res, {
    status: 201,
    data: result,
    message: "Calculations done successfully",
  });
});
