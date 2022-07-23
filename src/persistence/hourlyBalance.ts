import { Prisma } from "@prisma/client";
import database from "persistence/persistence.config";

// TODO revisar luego el create, update y delete
export const operations = {
  getOneTAS: (params: Prisma.HourlyBalanceTASWhereUniqueInput) => {
    return database.hourlyBalanceTAS.findUnique({
      where: params,
    });
  },
  getTAS: (
    params: Prisma.HourlyBalanceTASWhereInput,
    options: Omit<Prisma.HourlyBalanceTASFindManyArgs, "where">
  ) => {
    return database.hourlyBalanceTAS.findMany({
      where: params,
      ...options,
    });
  },
  getOneTeacher: (params: Prisma.HourlyBalanceTeacherWhereUniqueInput) => {
    return database.hourlyBalanceTeacher.findUnique({
      where: params,
    });
  },
  getTeacher: (params: Prisma.HourlyBalanceTeacherWhereInput) => {
    return database.hourlyBalanceTeacher.findMany({
      where: params,
    });
  },
  create: (data: Prisma.HourlyBalanceCreateArgs) => {
    return database.hourlyBalance.create(data);
  },
  updateTAS: (data: Prisma.HourlyBalanceTASUpdateArgs) => {
    return database.hourlyBalanceTAS.update(data);
  },
  update: (data: Prisma.HourlyBalanceUpdateArgs) => {
    return database.hourlyBalance.update(data);
  },
  deleteTAS: (id: string) => {
    return database.hourlyBalance.delete({
      where: {
        id,
      },
    });
  },
  deleteTeacher: (id: string) => {
    return database.hourlyBalance.delete({
      where: {
        id,
      },
    });
  },
};
