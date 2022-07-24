import { NextFunction, Request, Response } from "express";
import ErrorHandler from "validation/ErrorHandler";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const errorHandlerInstance = new ErrorHandler(error, req, res);
  errorHandlerInstance.handle();
}
