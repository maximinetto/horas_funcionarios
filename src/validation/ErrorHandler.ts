import { logger } from "config";
import CustomError from "errors/CustomError";
import ModelAlreadyExistsError from "errors/ModelAlreadyExistsError";
import { FastifyReply, FastifyRequest } from "fastify";

export default class ErrorHandler {
  private error: Error;
  private response: FastifyReply;

  constructor(error: Error, _request: FastifyRequest, response: FastifyReply) {
    this.error = error;
    this.response = response;
  }

  public handle(): void | FastifyReply {
    logger.error(this.error);

    if (this.error instanceof CustomError) {
      return this.response.status(400).send({
        message: this.error.message,
      });
    }

    if (this.error instanceof ModelAlreadyExistsError) {
      return this.response.status(409).send({
        message: this.error.message,
        description: this.error.description,
      });
    }

    this.internalErrorResponse();
  }

  private internalErrorResponse() {
    this.response.status(500).send({
      error: "Internal server error",
      message: "Something went wrong",
    });
  }
}
