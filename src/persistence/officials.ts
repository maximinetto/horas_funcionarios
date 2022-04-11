import { OfficialWithoutId } from "@/@types/officials";
import { Prisma } from "@prisma/client";
import database from "persistence/persistence.config";

export const operations = {
  getOne: (id: number) =>
    database.official.findUnique({
      where: {
        id,
      },
    }),
  get: (where: Prisma.OfficialWhereInput) => {
    return database.official.findMany({
      where: {
        ...where,
      },
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
  }: OfficialWithoutId) => {
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
    id: number,
    {
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    }: OfficialWithoutId
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
  delete: (id: number) => {
    return database.official.delete({
      where: { id },
    });
  },
};
