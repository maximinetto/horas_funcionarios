import { FastifyReply, FastifyRequest } from "fastify";
import ErrorHandler from "validation/ErrorHandler";

export default function errorHandler(
  error: Error,
  req: FastifyRequest,
  reply: FastifyReply
) {
  const errorHandlerInstance = new ErrorHandler(error, req, reply);
  errorHandlerInstance.handle();
}
