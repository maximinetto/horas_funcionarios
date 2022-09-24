import { PrismaClient } from "@prisma/client";

import HourlyBalance from "../../entities/HourlyBalance";
import HourlyBalanceEntityFactoryCreator from "../../factories/HourlyBalanceEntityFactoryCreator";
import HourlyBalanceModelFactoryCreator from "../../factories/HourlyBalanceModelFactoryCreator";
import HourlyBalanceRepository from "../HourlyBalance/HourlyBalanceRepository";
import PrismaRepository from "../PrismaRepository";

// TODO revisar luego el create, update y delete
export default class PrismaHourlyBalanceRepository
  extends PrismaRepository<string, HourlyBalance>
  implements HourlyBalanceRepository
{
  private _hourlyBalanceEntityFactoryCreator: HourlyBalanceEntityFactoryCreator;
  private _hourlyBalanceModelFactoryCreator: HourlyBalanceModelFactoryCreator;

  constructor({
    prisma,
    hourlyBalanceEntityFactoryCreator,
    hourlyBalanceModelFactoryCreator,
  }: {
    prisma: PrismaClient;
    hourlyBalanceEntityFactoryCreator: HourlyBalanceEntityFactoryCreator;
    hourlyBalanceModelFactoryCreator: HourlyBalanceModelFactoryCreator;
  }) {
    super({ prisma, modelName: "HourlyBalance" });
    this._hourlyBalanceEntityFactoryCreator = hourlyBalanceEntityFactoryCreator;
    this._hourlyBalanceModelFactoryCreator = hourlyBalanceModelFactoryCreator;
  }

  toEntity(value: any): HourlyBalance {
    return this._hourlyBalanceEntityFactoryCreator.create(value);
  }

  toModel(value: HourlyBalance) {
    return this._hourlyBalanceModelFactoryCreator.create(value);
  }
}
