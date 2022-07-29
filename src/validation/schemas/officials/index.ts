import { Contract, TypeOfOfficials } from "@prisma/client";
import Joi from "joi";

const types = Object.values(TypeOfOfficials);
const contracts = Object.values(Contract);

const recordNumberOfficialSchema = Joi.number().min(1);
const firstNameOfficialSchema = Joi.string().min(1).max(255);
const lastNameOfficialSchema = Joi.string().min(1).max(255);
const positionOfficialSchema = Joi.string().min(1).max(255);
const dateOfEntryOfficialSchema = Joi.date().iso();
const chargeNumberOfficialSchema = Joi.number().min(1);
const typeOfficialSchema = Joi.string().valid(...types);
const contractOfficialSchema = Joi.string().valid(...contracts);
const officialIdSchema = Joi.number().min(1);

export const schemas = {
  get: Joi.object({
    type: typeOfficialSchema.optional(),
    contract: contractOfficialSchema.optional(),
    year: Joi.number().optional(),
  }),
  create: Joi.object().keys({
    recordNumber: recordNumberOfficialSchema.required(),
    firstName: firstNameOfficialSchema.required(),
    lastName: lastNameOfficialSchema.required(),
    position: positionOfficialSchema.required(),
    dateOfEntry: dateOfEntryOfficialSchema.required(),
    chargeNumber: chargeNumberOfficialSchema.required(),
    type: typeOfficialSchema.required(),
    contract: contractOfficialSchema.required(),
  }),
  update: Joi.object()
    .keys({
      recordNumber: recordNumberOfficialSchema,
      firstName: firstNameOfficialSchema,
      lastName: lastNameOfficialSchema,
      position: positionOfficialSchema,
      dateOfEntry: dateOfEntryOfficialSchema,
      chargeNumber: chargeNumberOfficialSchema,
      type: typeOfficialSchema,
      contract: contractOfficialSchema,
    })
    .min(1),
  id: Joi.object().keys({
    id: officialIdSchema.required(),
  }),
};
