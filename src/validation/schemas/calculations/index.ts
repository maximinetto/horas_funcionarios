import Joi from "joi";

const time = Joi.string()
  .regex(/^(\d+)\:([0-5]\d)$/)
  .default("00:00");

const base = {
  id: Joi.string().uuid({ version: "uuidv4" }),
  month: Joi.number().integer().min(1).max(12).required(),
  observations: Joi.string().allow(""),
  actualBalanceId: Joi.string().uuid({ version: "uuidv4" }).when("id", {
    is: Joi.string().exist(),
    then: Joi.string().required(),
  }),
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

const teacher = {
  surplus: time,
  discount: time,
};

export const schemas = {
  create: Joi.object({
    calculations: Joi.array()
      .items({ ...base, ...tas }, { ...base, ...teacher })
      .min(1)
      .required(),
  }),
  paramsCreate: Joi.object({
    year: Joi.number().integer().min(2000).required(),
    officialId: Joi.number().integer().min(1).required(),
  }),
};
