import { FastifyRequest } from "fastify";

import CalculationTASDTOWithTimeFieldsInString from "../../../dto/create/CalculationTASDTOWithTimeFieldsInString";

export default function validate(
  request: FastifyRequest<{
    Body: {
      calculations: CalculationTASDTOWithTimeFieldsInString[];
    };
    Params: {
      year: number;
      officialId: number;
    };
  }>
) {
  const { year, officialId } = request.params;
  return {
    year,
    officialId,
    ...request.body,
  };
}
