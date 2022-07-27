import { Decimal } from "decimal.js";
import ActualBalanceEntity from "entities/ActualBalance";
import NullOfficial from "entities/null_object/NullOfficial";
import Official from "entities/Official";
import { ActualBalanceComplete } from "types/actualBalance";

import { AbstractConverter } from "./AbstractConverter";
import CalculationConverter from "./CalculationConverter";
import HourlyBalanceConverter from "./HourlyBalanceConverter";
import OfficialConverter from "./OfficialConverter";

export default class ActualBalanceConverter extends AbstractConverter<
  ActualBalanceComplete,
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

  fromModelToEntity(model: ActualBalanceComplete): ActualBalanceEntity {
    console.log("hola");
    console.log("this.officialConverter:", this.officialConverter);
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

    return new ActualBalanceEntity(
      model.id,
      model.year,
      new Decimal(model.total.toString()),
      official,
      hourlyBalances,
      calculations
    );
  }
  fromEntityToModel(entity: ActualBalanceEntity): ActualBalanceComplete {
    console.log("this:", this);
    const official = entity.official.map((value) =>
      this.officialConverter.fromEntityToModel(value)
    );
    const calculations = this.calculationConverter.fromEntitiesToModels(
      entity.calculations
    );

    const hourlyBalances = this.hourlyBalanceConverter.fromEntitiesToModels(
      entity.hourlyBalances
    );

    return {
      id: entity.id,
      officialId: entity.official.orElse(new NullOfficial()).id,
      year: entity.year,
      total: BigInt(entity.total.toString()),
      official: official.get(),
      calculations,
      hourlyBalances,
    };
  }
}
