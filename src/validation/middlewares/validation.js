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

export const exists = ({ key, entity, property = "params" }) =>
  asyncHandler(async (req, res, next) => {
    const value = req[property][key];
    try {
      const exists = await valueExistsInPersistence({ value, key, entity });
      if (exists) {
        next();
      } else {
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

const valueExistsInPersistence = ({ value, key, entity }) => {
  const exists = Object.keys(persistence).find((k) => k === entity);
  if (!exists) {
    throw new NotExistsError(`${entity} does not exists`);
  }

  return persistence[entity].findUnique({
    where: { [key]: value },
    select: {
      [key]: true,
    },
  });
};

function callToNextHandler(value, req, next) {
  req.value = { ...req.value, ...value };
  next();
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
