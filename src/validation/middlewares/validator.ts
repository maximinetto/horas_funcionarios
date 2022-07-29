import { FastifyRouteSchemaDef } from "fastify/types/schema";
import { ValidationError } from "joi";

const joiOptions = {
  abortEarly: false,
  convert: true,
};

export default function validator({ schema }: FastifyRouteSchemaDef<any>) {
  return async (data) => {
    try {
      const { value, error } = await schema.validate(data, joiOptions);
      const valid = error == null;
      if (valid) return callToNextHandler(value);
      else throw throwErrorWhenDataIsNotValid(error);
    } catch (err) {
      return err;
    }
  };
}

function callToNextHandler(value) {
  return {
    value,
  };
}

function throwErrorWhenDataIsNotValid(error: ValidationError) {
  const { details } = error;
  return {
    message: "The request is not valid. You have provided invalid data.",
    error: {
      details: details.map((d) => ({
        message: d.message,
        key: d.context == null ? "unknown" : d.context.key,
        value: d.context == null ? null : d.context.value,
      })),
    },
    ok: false,
  };
}
