import { calculator } from "dependencies/container";
import CalculationTASDTOWithTimeFieldsInString from "dto/create/calculationTASDTOWithTimeFieldsInString";
import { FastifyReply, FastifyRequest } from "fastify";
import response from "utils/response";
import validate from "validation/requests/calculations/create";

export const createHours = async (
  req: FastifyRequest<{
    Body: {
      calculations: CalculationTASDTOWithTimeFieldsInString[];
    };
    Params: { year: number; officialId: number };
  }>,
  reply: FastifyReply
) => {
  const validatedData = validate(req);

  const result = await calculator.execute(validatedData);
  response(reply, {
    status: 201,
    data: result,
    message: "Calculations done successfully",
  });
};
