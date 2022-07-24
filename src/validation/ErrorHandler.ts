import { logger } from "config";
import CustomError from "errors/CustomError";
import { Request, Response } from "express";

export default class ErrorHandler {
  private error: Error;
  private request: Request;
  private response: Response;

  constructor(error: Error, request: Request, response: Response) {
    this.error = error;
    this.request = request;
    this.response = response;
  }

  public handle(): void {
    logger.error(this.error);

    if (this.error instanceof CustomError) {
      this.response.status(400).json({
        message: this.error.message,
      });
    }

    this.internalErrorResponse();
  }

  private internalErrorResponse() {
    this.response.status(500).json({
      error: "Internal server error",
      message: "Something went wrong",
    });
  }
}
