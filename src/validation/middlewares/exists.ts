import NotExistsError from "errors/NotExistsError";
import { FastifyRequest } from "fastify";
import _get from "lodash/get";
import { valueExistsInPersistence } from "persistence/entity";

export const exists =
  ({
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
  async (req, res, done) => {
    let value = getValue(key, req, property, find);
    if (typeof value === "undefined") {
      throw new NotExistsError(`${key} does not exists`);
    }

    if (typeof value === "boolean" && value === false) {
      return done();
    }

    try {
      const valueAlreadyExists = await valueExistsInPersistence({
        value,
        key,
        entity,
        relatedKey,
      });

      console.log(valueAlreadyExists);
      if (
        (valueAlreadyExists && mustExists) ||
        (!valueAlreadyExists && !mustExists)
      ) {
        return done();
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
        return done(err);
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
  };

function getValue(
  key: string,
  req: FastifyRequest,
  property: string,
  find?: (key: string, obj: any) => any
) {
  const obj = _get(req, property);

  if (find === undefined) {
    return _get(obj, key);
  }

  return find(key, obj);
}
