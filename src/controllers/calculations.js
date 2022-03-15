import { asyncHandler } from "dependencies";
import { calculate } from "services/calculations";
import response from "utils/response";

export const createHours = asyncHandler(async (req, res) => {
  const result = await calculate(req.value);

  return response(res, {
    status: 201,
    data: result,
    message: "Calculations done successfully",
  });
});
