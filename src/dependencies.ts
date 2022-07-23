import express, { NextFunction } from "express";
import core from "express-serve-static-core";

// eslint-disable-next-line
export const createRouter = () => express.Router();
export const app = express();
export const asyncHandler =
  <
    P = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query
  >(
    callback: (
      ...args: Parameters<express.RequestHandler<P, ResBody, ReqBody, ReqQuery>>
    ) => Promise<any | void> | any | void
  ) =>
  (
    ...args: Parameters<express.RequestHandler<P, ResBody, ReqBody, ReqQuery>>
  ): void | Promise<void> => {
    const result = callback(...args);
    const next = args[args.length - 1] as NextFunction;
    if (result instanceof Promise) {
      result.catch((e) => next(e));
    }
  };
