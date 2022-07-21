import { Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import { Optional } from "typescript-optional";

import { OfficialWithoutId } from "@/@types/officials";
import Official from "@/entities/Official";
import type prisma from "@/persistence/persistence.config";

export default class OfficialRepository {
  private database: typeof prisma;

  constructor({ database }: { database: typeof prisma }) {
    this.database = database;
  }

  getOne(id: number): Promise<Optional<Official>> {
    return this.database.official
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
      });
  }

  get(where: Prisma.OfficialWhereInput) {
    return this.database.official.findMany({
      where: {
        ...where,
      },
    });
  }

  create({
    recordNumber,
    firstName,
    lastName,
    position,
    dateOfEntry,
    chargeNumber,
    type,
    contract,
  }: OfficialWithoutId) {
    return this.database.official.create({
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
  }

  update(
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
  ) {
    return this.database.official.update({
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
  }
  delete(id: number) {
    return this.database.official.delete({
      where: { id },
    });
  }
}
