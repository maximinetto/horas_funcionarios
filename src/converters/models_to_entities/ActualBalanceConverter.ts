import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import { Decimal } from "decimal.js";
import ActualBalanceEntity from "entities/ActualBalance";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import ActualBalanceTeacher from "entities/ActualBalanceTeacher";
import NullOfficial from "entities/null_object/NullOfficial";
import Official from "entities/Official";
import { TypeOfOfficial } from "enums/officials";
import UnexpectedValueError from "errors/UnexpectedValueError";
import {
  ActualBalanceComplete,
  PartialActualBalance,
} from "types/actualBalance";
import { Official as OfficialModel } from "types/officials";

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
  private _actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;

  constructor({
    officialConverter,
    hourlyBalanceConverter,
    calculationConverter,
    actualHourlyBalanceBuilder,
  }: {
    officialConverter: OfficialConverter;
    hourlyBalanceConverter: HourlyBalanceConverter;
    calculationConverter: CalculationConverter;
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  }) {
    super();
    this.officialConverter = officialConverter;
    this.hourlyBalanceConverter = hourlyBalanceConverter;
    this.calculationConverter = calculationConverter;
    this._actualHourlyBalanceBuilder = actualHourlyBalanceBuilder;

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

    const { type } = official;

    if (type === TypeOfOfficial.TEACHER)
      return this._actualHourlyBalanceBuilder.create({
        id: model.id,
        year: model.year,
        total: new Decimal(model.total.toString()),
        official: official,
        type: TypeOfOfficial.TEACHER,
        hourlyBalances,
        calculations,
      });
    else if (type === TypeOfOfficial.TAS) {
      return this._actualHourlyBalanceBuilder.create({
        id: model.id,
        year: model.year,
        total: new Decimal(model.total.toString()),
        type: TypeOfOfficial.TAS,
        official: official,
        hourlyBalances,
        calculations,
      });
    }

    throw new UnexpectedValueError("Type not found");
  }
  fromEntityToModel(entity: ActualBalanceEntity): ActualBalanceComplete {
    const calculations = this.calculationConverter.fromEntitiesToModels(
      entity.getCalculations()
    );

    const hourlyBalances = this.hourlyBalanceConverter.fromEntitiesToModels(
      entity.getHourlyBalances()
    );
    const officialEntity = entity.official ?? NullOfficial.default();
    const official = this.officialConverter.fromEntityToModel(officialEntity);

    official.id = entity.official ? entity.official.id : new NullOfficial().id;

    let type: TypeOfOfficial;
    if (entity instanceof ActualBalanceTAS) type = TypeOfOfficial.TAS;
    else if (entity instanceof ActualBalanceTeacher)
      type = TypeOfOfficial.TEACHER;
    else
      throw new UnexpectedValueError(
        "The subtype of actual balance is not recognized"
      );

    return {
      id: entity.id,
      officialId: official.id,
      year: entity.year,
      total: BigInt(entity.total.toString()),
      official: official as OfficialModel,
      calculations,
      hourlyBalances,
      type,
    };
  }
}
