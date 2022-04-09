import database from "persistence/persistence.config";

export const operations = {
  getOne: (where, options) => {
    return database.calculation.findUnique({
      where,
      ...options,
    });
  },
  get: (where, options) => {
    return database.calculation.findMany({
      where,
      ...options,
    });
  },
  createTAS: ({
    year,
    month,
    observations,
    officialId,
    compensatedNightOvertime,
    nonWorkingNightOvertime,
    nonWorkingOvertime,
    surplusBusiness,
    surplusNonWorking,
    surplusSimple,
    workingNightOvertime,
    workingOvertime,
    discount,
  }) => {
    return database.calculationTAS.create({
      data: {
        calculation: {
          create: {
            observations,
            year,
            month,
            officialId,
          },
        },
        compensatedNightOvertime,
        nonWorkingNightOvertime,
        nonWorkingOvertime,
        surplusBusiness,
        surplusNonWorking,
        surplusSimple,
        workingNightOvertime,
        workingOvertime,
        discount,
      },
    });
  },
  createTeacher: ({
    year,
    month,
    observations,
    officialId,
    discount,
    surplus,
  }) => {
    return database.calculationTeacher.create({
      data: {
        calculation: {
          create: {
            observations,
            year,
            month,
            officialId,
          },
        },
        discount,
        surplus,
      },
    });
  },
  updateTAS: (
    id,
    {
      year,
      month,
      observations,
      officialId,
      compensatedNightOvertime,
      nonWorkingNightOvertime,
      nonWorkingOvertime,
      surplusBusiness,
      surplusNonWorking,
      surplusSimple,
      workingNightOvertime,
      workingOvertime,
      discount,
    }
  ) => {
    return database.calculationTAS.update({
      where: {
        id,
      },
      data: {
        calculation: {
          update: {
            observations,
            year,
            month,
            officialId,
          },
        },
        compensatedNightOvertime,
        nonWorkingNightOvertime,
        nonWorkingOvertime,
        surplusBusiness,
        surplusNonWorking,
        surplusSimple,
        workingNightOvertime,
        workingOvertime,
        discount,
      },
    });
  },
  updateTeacher: (
    id,
    { year, month, observations, officialId, discount, surplus }
  ) => {
    return database.calculationTeacher.update({
      where: {
        id,
      },
      data: {
        calculation: {
          update: {
            observations,
            year,
            month,
            officialId,
          },
        },
        discount,
        surplus,
      },
    });
  },
  delete: (id) => {
    return database.calculation.delete({
      where: {
        id,
      },
    });
  },
};
