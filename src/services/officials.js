import { operations } from "persistence/officials";
import removeKeyIfValueDoesNotDefined from "utils/removeKeyIfValueDoesNotDefined";

const service = {
  get: async ({ type, contract, year } = {}) => {
    const where = {
      type,
      contract,
      year,
    };

    removeKeyIfValueDoesNotDefined(where);

    return await operations.get(where);
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
