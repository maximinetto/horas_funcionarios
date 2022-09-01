import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import Official from "entities/Official";
import { mikroorm } from "persistence/context/mikroorm/MikroORMDatabase";

import OfficialBuilder from "./OfficialBuilder";
import { OfficialModel } from "./types";

export default class MikroORMOfficialBuilder implements OfficialBuilder {
  private _actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;

  constructor({
    actualHourlyBalanceBuilder,
  }: {
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  }) {
    this._actualHourlyBalanceBuilder = actualHourlyBalanceBuilder;
  }

  create(official: OfficialModel): Official {
    const {
      firstName,
      lastName,
      contract,
      position,
      dateOfEntry,
      chargeNumber,
      recordNumber,
      type,
      actualBalances,
    } = official;

    const _actualBalances = actualBalances
      ? actualBalances.map((a) => this._actualHourlyBalanceBuilder.create(a))
      : undefined;

    return mikroorm.em.create(Official, {
      id: official.id ?? null,
      firstName,
      lastName,
      contract,
      position,
      dateOfEntry,
      chargeNumber,
      recordNumber,
      type,
      actualBalances: _actualBalances,
      createdAt: official.createdAt,
      updatedAt: official.updatedAt,
    });
  }
}
