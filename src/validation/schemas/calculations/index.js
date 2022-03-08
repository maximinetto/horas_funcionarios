import Joi from "joi";

const surplus = Joi.number().min(0).default(0);

export const schemas = {
  create: Joi.array().items({
    id: Joi.string().uuid({ version: "uuidv4" }),
    year: Joi.number().integer().min(2000).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    surplusBusiness: surplus,
    surplusNonWorking: surplus,
    surplusSimple: surplus,
    discount: surplus,

  }),
};
