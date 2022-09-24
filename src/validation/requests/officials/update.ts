import { FastifyRequest } from "fastify";

import { OfficialWithOptionalId } from "../../../types/officials";

export default function validate(
  request: FastifyRequest<{
    Body: OfficialWithOptionalId;
    Params: {
      id: number;
    };
  }>
) {
  const { id } = request.params;
  return {
    id,
    ...request.body,
  };
}
