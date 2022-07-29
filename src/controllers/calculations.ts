import { calculator } from "dependencies/container";
import CalculationTASDTOWithTimeFieldsInString from "dto/create/calculationTASDTOWithTimeFieldsInString";
import { FastifyReply, FastifyRequest } from "fastify";
import response from "utils/response";

export const createHours = async (
  req: FastifyRequest<{
    Body: {
      value: {
        calculations: CalculationTASDTOWithTimeFieldsInString[];
        year: number;
        officialId: number;
      };
    };
  }>,
  reply: FastifyReply
) => {
  const result = await calculator.execute(req.body.value);
  response(reply, {
    status: 201,
    data: result,
    message: "Calculations done successfully",
  });
};
