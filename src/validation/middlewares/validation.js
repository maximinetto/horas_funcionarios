import _get from "lodash/get";
import _merge from "lodash/merge";
import { asyncHandler } from "dependencies";
import NotExistsError from "errors/NotExistsError";
import persistence from "persistence/persistence.config";

export default function middleware(schema, property = "body") {
  return asyncHandler(async (req, res, next) => {
    const { value, error } = await schema.validate(req[property], {
      abortEarly: false,
      convert: true,
    });
    const valid = error == null;

    valid
      ? callToNextHandler(value, req, next)
      : throwErrorWhenDataIsNotValid(error, res);
  });
}

export const exists = ({
  key,
  entity,
  property = "params",
  find = undefined,
  relatedKey = undefined,
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
      const exists = await valueExistsInPersistence({
        value,
        key,
        entity,
        relatedKey,
      });
      if (exists) {
        next();
      } else {
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
      }
    } catch (err) {
      if (err instanceof NotExistsError) {
        return res
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

      next(err);
    }
  });

const valueExistsInPersistence = ({ value, key, entity, relatedKey }) => {
  const exists = Object.keys(persistence).find((k) => k === entity);
  if (!exists) {
    throw new NotExistsError(`${entity} does not exists`);
  }

  const keyToFind = relatedKey ?? key;

  if (!Array.isArray(value)) {
    return persistence[entity].findUnique({
      where: { [keyToFind]: value },
      select: {
        [keyToFind]: true,
      },
    });
  }

  return persistence[entity]
    .findMany({
      where: { [keyToFind]: { in: value } },
      select: {
        [keyToFind]: true,
      },
    })
    .then((result) => {
      return result.length === value.length;
    });
};

function callToNextHandler(value, req, next) {
  if (req.value == null && Array.isArray(value)) {
    req.value = [];
  }
  req.value = _merge(req.value, value);
  next();
}

function getValue(key, req, property, find) {
  const obj = _get(req, property);

  if (find === undefined) {
    return _get(obj, key);
  }

  return find(key, obj);
}

function throwErrorWhenDataIsNotValid(error, res) {
  const { details } = error;
  res.status(422).json({
    message: "The request is not valid. You have provided invalid data.",
    error: {
      details: details.map((d) => ({
        message: d.message,
        key: d.context.key,
        value: d.context.value,
      })),
    },
    ok: false,
  });
}
