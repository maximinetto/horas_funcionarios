import {
  ActualBalance as ActualBalanceModel,
  Contract,
  TypeOfOfficials,
} from "@prisma/client";
import { Decimal } from "decimal.js";
import { DateTime } from "luxon";
import { Optional } from "typescript-optional";

import { ActualBalanceWithHourlyBalancesTAS } from "@/@types/actualBalance";
import ActualBalanceEntity from "@/entities/ActualBalance";
import HourlyBalance from "@/entities/HourlyBalance";
import HourlyBalanceTAS from "@/entities/HourlyBalanceTAS";
import NullOfficial from "@/entities/null_object/NullOfficial";
import Official from "@/entities/Official";

import { AbstractConverter } from "./converter";

export default class ActualBalanceConverter extends AbstractConverter<
  ActualBalanceModel,
  ActualBalanceEntity
> {
  fromModelToEntity(model: ActualBalanceModel): ActualBalanceEntity {
    return new ActualBalanceEntity(
      model.id,
      model.year,
      new Decimal(model.total.toString()),
      new Official(
        model.officialId,
        0,
        "",
        "",
        "",
        Contract.PERMANENT,
        TypeOfOfficials.NOT_TEACHER,
        DateTime.fromJSDate(new Date()),
        0
      )
    );
  }
  fromEntityToModel(entity: ActualBalanceEntity): ActualBalanceModel {
    return {
      id: entity.id,
      officialId: entity.official.orElse(new NullOfficial()).id,
      year: entity.year,
      total: BigInt(entity.total.toString()),
    };
  }

  fromModelToEntityWithTAS(model: ActualBalanceWithHourlyBalancesTAS) {
    const hourlyBalances: HourlyBalance[] = model.hourlyBalances.map(
      (hourlyBalance) => {
        return new HourlyBalanceTAS(
          hourlyBalance.id,
          hourlyBalance.year,
          new Decimal(hourlyBalance.hourlyBalanceTAS.working.toString()),
          new Decimal(hourlyBalance.hourlyBalanceTAS.nonWorking.toString()),
          new Decimal(hourlyBalance.hourlyBalanceTAS.simple.toString()),
          hourlyBalance.hourlyBalanceTAS.id
        );
      }
    );

    const actualBalance = new ActualBalanceEntity(
      model.id,
      model.year,
      new Decimal(model.total.toString()),
      new Official(
        model.officialId,
        0,
        "",
        "",
        "",
        Contract.PERMANENT,
        TypeOfOfficials.NOT_TEACHER,
        DateTime.fromJSDate(new Date()),
        0
      )
    );

    hourlyBalances.forEach((hourlyBalance) => {
      const actualBalanceOptional = Optional.of(actualBalance);
      hourlyBalance.actualBalance = actualBalanceOptional;
    });

    actualBalance.hourlyBalances = hourlyBalances;

    return actualBalance;
  }

  fromModelsToEntitiesWithTAS(models: ActualBalanceWithHourlyBalancesTAS[]) {
    const actualBalances: ActualBalanceEntity[] = models.map((model) => {
      return this.fromModelToEntityWithTAS(model);
    });

    return actualBalances;
  }
}
