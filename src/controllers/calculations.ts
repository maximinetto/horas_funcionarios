import { FastifyReply, FastifyRequest } from "fastify";

import { logger } from "../config";
import { calculator } from "../dependencies/container";
import CalculationTASDTOWithTimeFieldsInString from "../dto/create/CalculationTASDTOWithTimeFieldsInString";
import response from "../utils/response";
import validate from "../validation/requests/calculations/create";

export const createHours = async (
  req: FastifyRequest<{
    Body: {
      calculations: CalculationTASDTOWithTimeFieldsInString[];
    };
    Params: { year: number; officialId: number };
  }>,
  reply: FastifyReply
) => {
  try {
    const validatedData = validate(req);

    const result = await calculator.execute(validatedData);

    response(reply, {
      status: 201,
      data: result,
      message: "Calculations done successfully",
    });
  } catch (err) {
    logger.error(err);
    reply.status(500).send({
      error: "Something was wrong",
    });
  }
};
