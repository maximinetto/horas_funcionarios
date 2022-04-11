import { Contract, TypeOfOfficials } from "@prisma/client";
import { date, number, object, string } from "joi";

const types = Object.values(TypeOfOfficials);
const contracts = Object.values(Contract);

const recordNumberOfficialSchema = number().min(1);
const firstNameOfficialSchema = string().min(1).max(255);
const lastNameOfficialSchema = string().min(1).max(255);
const positionOfficialSchema = string().min(1).max(255);
const dateOfEntryOfficialSchema = date();
const chargeNumberOfficialSchema = number().min(1);
const typeOfficialSchema = string().valid(types);
const contractOfficialSchema = string().valid(contracts);
const officialIdSchema = number().min(1);

export const schemas = {
  get: object({
    type: typeOfficialSchema.optional(),
    contract: contractOfficialSchema.optional(),
    year: number().optional(),
  }),
  create: object().keys({
    recordNumber: recordNumberOfficialSchema.required(),
    firstName: firstNameOfficialSchema.required(),
    lastName: lastNameOfficialSchema.required(),
    position: positionOfficialSchema.required(),
    dateOfEntry: dateOfEntryOfficialSchema.required(),
    chargeNumber: chargeNumberOfficialSchema.required(),
    type: typeOfficialSchema.required(),
    contract: contractOfficialSchema.required(),
  }),
  update: object()
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
  id: object().keys({
    id: officialIdSchema.required(),
  }),
};
