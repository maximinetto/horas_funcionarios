import { Contract, TypeOfOfficials } from "@prisma/client";

import { IOfficialRepository } from "@/persistence/officials";
import { lastDateOfTheYear } from "@/utils/date";
import removeKeyIfValueDoesNotDefined from "@/utils/removeKeyIfValueDoesNotDefined";

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

    const officials = await this.officialRepository.get(where);

    return officials;
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
    removeKeyIfValueDoesNotDefined(fields);

    return this.officialRepository.update(id, fields);
  }
  async delete(id) {
    return this.officialRepository.delete(id);
  }
}
