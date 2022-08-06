import { Official as OfficialModel } from "@prisma/client";
import { Decimal } from "decimal.js";
import ActualBalanceEntity from "entities/ActualBalance";
import NullOfficial from "entities/null_object/NullOfficial";
import Official from "entities/Official";
import {
  ActualBalanceComplete,
  PartialActualBalance,
} from "types/actualBalance";

import { AbstractConverter } from "./AbstractConverter";
import CalculationConverter from "./CalculationConverter";
import HourlyBalanceConverter from "./HourlyBalanceConverter";
import OfficialConverter from "./OfficialConverter";

export default class ActualBalanceConverter extends AbstractConverter<
  PartialActualBalance,
  ActualBalanceEntity
> {
  private officialConverter: OfficialConverter;
  private hourlyBalanceConverter: HourlyBalanceConverter;
  private calculationConverter: CalculationConverter;

  constructor({
    officialConverter,
    hourlyBalanceConverter,
    calculationConverter,
  }: {
    officialConverter: OfficialConverter;
    hourlyBalanceConverter: HourlyBalanceConverter;
    calculationConverter: CalculationConverter;
  }) {
    super();
    this.officialConverter = officialConverter;
    this.hourlyBalanceConverter = hourlyBalanceConverter;
    this.calculationConverter = calculationConverter;

    this.fromEntityToModel = this.fromEntityToModel.bind(this);
  }

  fromModelToEntity(model: PartialActualBalance): ActualBalanceEntity {
    const official = model.official
      ? this.officialConverter.fromModelToEntity(model.official)
      : Official.default(model.officialId);

    const hourlyBalances =
      model.hourlyBalances != null
        ? this.hourlyBalanceConverter.fromModelToEntities(model.hourlyBalances)
        : [];

    const calculations =
      model.calculations != null
        ? this.calculationConverter.fromModelsToEntities(model.calculations)
        : [];

    return new ActualBalanceEntity({
      id: model.id,
      year: model.year,
      total: new Decimal(model.total.toString()),
      official: official,
      hourlyBalances,
      calculations,
    });
  }
  fromEntityToModel(entity: ActualBalanceEntity): ActualBalanceComplete {
    const calculations = this.calculationConverter.fromEntitiesToModels(
      entity.calculations.getItems()
    );

    const hourlyBalances = this.hourlyBalanceConverter.fromEntitiesToModels(
      entity.hourlyBalances.getItems()
    );
    const officialEntity = entity.official ?? NullOfficial.default();
    const official = this.officialConverter.fromEntityToModel(officialEntity);

    official.id = entity.official ? entity.official.id : new NullOfficial().id;

    return {
      id: entity.id,
      officialId: official.id,
      year: entity.year,
      total: BigInt(entity.total.toString()),
      official: official as OfficialModel,
      calculations,
      hourlyBalances,
    };
  }
}
