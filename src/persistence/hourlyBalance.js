import database from "persistence/persistence.config";

// TODO revisar luego el create, update y delete
export const operations = {
  getOneTAS: (params) => {
    return database.hourlyBalanceTAS.findUnique({
      where: params,
    });
  },
  getTAS: (params, options) => {
    return database.hourlyBalanceTAS.findMany({
      where: params,
      ...options,
    });
  },
  getOneTeacher: (params) => {
    return database.hourlyBalanceTeacher.findUnique({
      where: params,
    });
  },
  getTeacher: (params) => {
    return database.hourlyBalanceTeacher.findMany({
      where: params,
    });
  },
  create: ({ year, yearBalance, working, nonWorking, simple, officialId }) => {
    return database.hourlyBalance.create({
      data: {
        year,
        yearBalance,
        working,
        nonWorking,
        simple,
        officialId,
      },
    });
  },
  updateTAS: (
    id,
    { year, yearBalance, working, nonWorking, simple, officialId }
  ) => {
    return database.hourlyBalanceTAS.update({
      where: {
        id,
      },
      data: {
        year,
        yearBalance,
        working,
        nonWorking,
        simple,
        officialId,
      },
    });
  },
  update: (id, { year, yearBalance, officialId, balance }) => {
    return database.hourlyBalance.update({
      where: {
        id,
      },
      data: {
        year,
        yearBalance,
        balance,
        officialId,
      },
    });
  },
  deleteTAS: (id) => {
    return database.hourlyBalance.delete({
      where: {
        id,
      },
    });
  },
  deleteTeacher: (id) => {
    return database.hourlyBalance.delete({
      where: {
        id,
      },
    });
  },
};
