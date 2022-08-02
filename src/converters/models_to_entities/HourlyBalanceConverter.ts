import { HourlyBalance as HourlyBalanceModel } from "@prisma/client";
import HourlyBalanceEntity from "entities/HourlyBalance";
import HourlyBalanceEntityFactoryCreator from "factories/HourlyBalanceEntityFactoryCreator";
import HourlyBalanceModelFactoryCreator from "factories/HourlyBalanceModelFactoryCreator";

export default class HourlyBalanceConverter {
  private hourlyBalanceEntityFactoryCreator: HourlyBalanceEntityFactoryCreator;
  private hourlyBalanceModelFactoryCreator: HourlyBalanceModelFactoryCreator;

  constructor({
    hourlyBalanceEntityFactoryCreator,
    hourlyBalanceModelFactoryCreator,
  }: {
    hourlyBalanceEntityFactoryCreator: HourlyBalanceEntityFactoryCreator;
    hourlyBalanceModelFactoryCreator: HourlyBalanceModelFactoryCreator;
  }) {
    this.hourlyBalanceEntityFactoryCreator = hourlyBalanceEntityFactoryCreator;
    this.hourlyBalanceModelFactoryCreator = hourlyBalanceModelFactoryCreator;
  }

  public fromModelToEntities(models: HourlyBalanceModel[]) {
    return this.hourlyBalanceEntityFactoryCreator.createAll(models);
  }
  public fromEntitiesToModels(entities: HourlyBalanceEntity[]) {
    return this.hourlyBalanceModelFactoryCreator.createAll(entities);
  }
}
