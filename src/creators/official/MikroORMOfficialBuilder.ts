import ActualHourlyBalanceBuilder from "../../creators/actual/ActualHourlyBalanceBuilder";
import Official from "../../entities/Official";
import { mikroorm } from "../../persistence/context/mikroorm/MikroORMDatabase";
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

  create({ insert = true, ...official }: OfficialModel): Official {
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

    const data = {
      id: official.id,
      firstName,
      lastName,
      contract,
      position,
      dateOfEntry,
      chargeNumber,
      recordNumber,
      type,
      actualBalances: _actualBalances,
    };

    if (!insert)
      return mikroorm.em.merge<Official>(Official, data, {
        refresh: true,
      });

    return new Official(data);
  }
}
