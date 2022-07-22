import { Contract, TypeOfOfficials } from "@prisma/client";

import { IOfficialRepository } from "@/persistence/officials";
import { lastDateOfTheYear } from "@/utils/date";
import removeKeyIfValueDoesNotDefinite from "@/utils/removeKeyIfValueDoesNotDefinite";

export default class OfficialService {
  private officialRepository: IOfficialRepository;

  constructor({
    officialRepository,
  }: {
    officialRepository: IOfficialRepository;
  }) {
    this.officialRepository = officialRepository;
  }

  async get({
    type,
    contract,
    year,
  }: {
    type?: TypeOfOfficials;
    contract?: Contract;
    year?: number;
  }) {
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

    return this.officialRepository.get(where);
  }
  async create({
    recordNumber,
    firstName,
    lastName,
    position,
    dateOfEntry,
    chargeNumber,
    type,
    contract,
  }) {
    return this.officialRepository.create({
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    });
  }
  async update(
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
  ) {
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
    removeKeyIfValueDoesNotDefinite(fields);

    return this.officialRepository.update(id, fields);
  }
  async delete(id) {
    return this.officialRepository.delete(id);
  }
}
