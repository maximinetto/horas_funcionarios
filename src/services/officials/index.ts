import { lastDateOfTheYear } from "@/utils/date";
import { Contract, TypeOfOfficials } from "@prisma/client";
import { operations } from "persistence/officials";
import removeKeyIfValueDoesNotDefined from "utils/removeKeyIfValueDoesNotDefined";

const service = {
  get: async ({
    type,
    contract,
    year,
  }: {
    type?: TypeOfOfficials;
    contract?: Contract;
    year?: number;
  }) => {
    const date = lastDateOfTheYear(year);
    const where = {
      type,
      contract,
      dateOfEntry: date
        ? {
            gte: new Date(`${year}-01-01`),
            lte: date,
          }
        : undefined,
    };

    const officials = await operations.get(where);

    return officials;
  },
  create: async ({
    recordNumber,
    firstName,
    lastName,
    position,
    dateOfEntry,
    chargeNumber,
    type,
    contract,
  }) => {
    return operations.create({
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    });
  },
  update: async (
    id,
    {
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    }
  ) => {
    const fields = {
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    };
    removeKeyIfValueDoesNotDefined(fields);

    return operations.update(id, fields);
  },
  delete: async (id) => {
    return operations.delete(id);
  },
};

export default service;
