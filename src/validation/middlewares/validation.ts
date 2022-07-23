import { asyncHandler } from "dependencies";
import NotExistsError from "errors/NotExistsError";
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { AnySchema, ValidationError } from "joi";
import _get from "lodash/get";
import _merge from "lodash/merge";
import { valueExistsInPersistence } from "persistence/entity";
import { Property } from "types/common";

export default function middleware(
  schema: AnySchema,
  property: Property = "body"
) {
  return asyncHandler(async (req, res, next) => {
    console.log(req[property]);
    const { value, error } = await schema.validate(req[property], {
      abortEarly: false,
      convert: true,
    });
    const valid = error == null;
    console.log("valid", valid);
    console.log("error", error);
    if (valid) callToNextHandler(value, res, next);
    else throwErrorWhenDataIsNotValid(error, res);
  });
}

export const exists = ({
  key,
  entity,
  property = "params",
  find = undefined,
  relatedKey = undefined,
  mustExists = false,
}: {
  key: string;
  entity: string;
  property?: string;
  find?: (key: string, obj: any) => any;
  relatedKey?: string;
  mustExists?: boolean;
}) =>
  asyncHandler(async (req, res, next) => {
    let value = getValue(key, req, property, find);
    if (typeof value === "undefined") {
      throw new NotExistsError(`${key} does not exists`);
    }

    if (typeof value === "boolean" && value === false) {
      return next();
    }

    try {
      const valueAlreadyExists = await valueExistsInPersistence({
        value,
        key,
        entity,
        relatedKey,
      });
      if (
        (valueAlreadyExists && mustExists) ||
        (!valueAlreadyExists && !mustExists)
      ) {
        return next();
      }

      value = Array.isArray(value) ? ` [${value}]` : value;
      res
        .status(422)
        .json({
          message: `The request is not valid. You have provided invalid data.`,
          error: {
            status: 422,
            reason: `The ${key}:${value} does not exists in ${entity}`,
            message: "The register does not exists in the database",
          },
          ok: false,
        })
        .end();
    } catch (err) {
      if (!(err instanceof NotExistsError)) {
        return next(err);
      }

      res
        .status(500)
        .json({
          message: "Something went wrong",
          error: {
            status: 500,
            reason: "Internal server error",
            message: "Something went wrong",
          },
          ok: false,
        })
        .end();
    }
  });

function callToNextHandler(value, res: Response, next: NextFunction) {
  if (res.locals.value == null && Array.isArray(value)) {
    res.locals.value = [];
  }
  res.locals.value = _merge(res.locals.value, value);
  next();
}

function getValue(
  key: string,
  req: Request,
  property: string,
  find?: (key: string, obj: any) => any
) {
  const obj = _get(req, property);

  if (find === undefined) {
    return _get(obj, key);
  }

  return find(key, obj);
}

function throwErrorWhenDataIsNotValid(error: ValidationError, res: Response) {
  const { details } = error;
  res.status(422).json({
    message: "The request is not valid. You have provided invalid data.",
    error: {
      details: details.map((d) => ({
        message: d.message,
        key: d.context == null ? "unknown" : d.context.key,
        value: d.context == null ? null : d.context.value,
      })),
    },
    ok: false,
  });
}
