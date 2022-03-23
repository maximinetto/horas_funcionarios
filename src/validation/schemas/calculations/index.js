import Joi from "joi";

const time = Joi.string()
  .regex(/^([0-9]+)\:([0-5]\d)$/)
  .default("00:00");

const base = {
  id: Joi.string().uuid({ version: "uuidv4" }),
  year: Joi.number().integer().min(2000).required(),
  month: Joi.number().integer().min(1).max(12).required(),
  observations: Joi.string().allow(""),
};

const tas = {
  surplusBusiness: time,
  surplusNonWorking: time,
  surplusSimple: time,
  discount: time,
  workingOvertime: time,
  workingNightOvertime: time,
  nonWorkingOvertime: time,
  nonWorkingNightOvertime: time,
  compensatedNightOvertime: time,
};

const theacher = {
  surplus: time,
  discount: time,
};

export const schemas = {
  create: Joi.object({
    calculations: Joi.array().items(
      { ...base, ...tas },
      { ...base, ...theacher }
    ),
  }),
  year: Joi.number().integer().min(2000).required(),
  officialId: Joi.number().integer().min(1).required(),
};