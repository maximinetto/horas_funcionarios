import {
  FastifyRouteSchemaDef,
  FastifyValidationResult,
} from "fastify/types/schema";
import { ValidationError } from "joi";

const joiOptions = {
  abortEarly: false,
  convert: true,
};

export default function validator({
  schema,
}: FastifyRouteSchemaDef<any>): FastifyValidationResult {
  return function (data) {
    const { value, error } = schema.validate(data, joiOptions);
    const valid = error == null;
    if (valid) return callToNextHandler(value);
    else throw throwErrorWhenDataIsNotValid(error);
  };
}

function callToNextHandler(value) {
  return {
    value,
  };
}

function throwErrorWhenDataIsNotValid(error: ValidationError) {
  return error;
}
