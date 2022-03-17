import database from "persistence/persistence.config";

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
  getBalance: ({ officialId, year }) => {
    return database.$queryRaw`SELECT * FROM hourly_balance_tas 
      WHERE official_id = ${officialId} AND year_balance = ${year} and 
      year >= (SELECT min(year) FROM hourly_balance_tas 
      WHERE official_id = ${officialId} AND year_balance = ${year} AND 
        (SELECT SUM(simple, working, non_working)
        FROM hourly_balance_tas
        WHERE official_id = ${officialId} AND year_balance = ${year})
      > 0)`;
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
  createTAS: ({
    year,
    yearBalance,
    working,
    nonWorking,
    simple,
    officialId,
  }) => {
    return database.hourlyBalanceTASTAS.create({
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
  createTeacher: ({ year, yearBalance, officialId, balance }) => {
    return database.hourlyBalanceTeacher.create({
      data: {
        year,
        yearBalance,
        balance,
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
  updateTeacher: (id, { year, yearBalance, officialId, balance }) => {
    return database.hourlyBalanceTASTeacher.update({
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
    return database.hourlyBalanceTAS.delete({
      where: {
        id,
      },
    });
  },
  deleteTeacher: (id) => {
    return database.hourlyBalanceTeacher.delete({
      where: {
        id,
      },
    });
  },
};
