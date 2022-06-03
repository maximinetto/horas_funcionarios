import { OfficialWithoutId } from "@/@types/officials";
import Official from "@/entities/Official";
import database from "@/persistence/persistence.config";
import { Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import { Optional } from "typescript-optional";

export const operations = {
  getOne: (id: number): Promise<Optional<Official>> =>
    database.official
      .findUnique({
        where: {
          id,
        },
      })
      .then((official) => {
        if (!official) {
          return Optional.empty();
        }
        return Optional.of(
          new Official(
            official.id,
            official.recordNumber,
            official.firstName,
            official.lastName,
            official.position,
            official.contract,
            official.type,
            DateTime.fromJSDate(official.dateOfEntry),
            official.chargeNumber
          )
        );
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
