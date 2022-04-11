import { array, number, object, string } from "joi";

const time = string()
  .regex(/^([0-9]+)\:([0-5]\d)$/)
  .default("00:00");

const base = {
  id: string().uuid({ version: "uuidv4" }),
  year: number().integer().min(2000).required(),
  month: number().integer().min(1).max(12).required(),
  observations: string().allow(""),
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
  create: object({
    calculations: array().items({ ...base, ...tas }, { ...base, ...teacher }),
  }),
  year: number().integer().min(2000).required(),
  officialId: number().integer().min(1).required(),
};
