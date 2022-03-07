import database from "persistence/persistence.config";

export const operations = {
  get: (params) => {
    return database.official.findMany({
      where: params,
    });
  },
  create: ({
    recordNumber,
    firstName,
    lastName,
    position,
    dateOfEntry,
    chargeNumber,
    type,
    contract,
  }) => {
    return database.official.create({
      data: {
        recordNumber,
        firstName,
        lastName,
        position,
        dateOfEntry,
        chargeNumber,
        type,
        contract,
      },
    });
  },
  update: (
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
    return database.official.update({
      where: { id },
      data: {
        recordNumber,
        firstName,
        lastName,
        position,
        dateOfEntry,
        chargeNumber,
        type,
        contract,
      },
    });
  },
  delete: (id) => {
    return database.official.delete({
      where: { id },
    });
  },
};
