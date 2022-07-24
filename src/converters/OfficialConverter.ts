import { Official as OfficialModel } from "@prisma/client";
import OfficialEntity from "entities/Official";
import { DateTime } from "luxon";

import { AbstractConverter } from "./AbstractConverter";

export default class OfficialConverter extends AbstractConverter<
  OfficialModel,
  OfficialEntity,
  {}
> {
  fromModelToEntity(model: OfficialModel): OfficialEntity {
    return new OfficialEntity(
      model.id,
      model.recordNumber,
      model.firstName,
      model.lastName,
      model.position,
      model.contract,
      model.type,
      DateTime.fromJSDate(model.dateOfEntry),
      model.chargeNumber
    );
  }
  fromEntityToModel(entity: OfficialEntity): OfficialModel {
    return {
      id: entity.id,
      recordNumber: entity.recordNumber,
      firstName: entity.firstName,
      lastName: entity.lastName,
      position: entity.position,
      contract: entity.contract,
      type: entity.type,
      dateOfEntry: entity.dateOfEntry.toJSDate(),
      chargeNumber: entity.chargeNumber,
    };
  }
}
