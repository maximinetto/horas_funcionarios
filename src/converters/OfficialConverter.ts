import OfficialEntity from "@/entities/Official";
import { Official as OfficialModel } from "@prisma/client";
import { DateTime } from "luxon";
import { AbstractConverter } from "./converter";

export default class OfficialConverter extends AbstractConverter<
  OfficialModel,
  OfficialEntity
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
      id: entity.getId(),
      recordNumber: entity.getRecordNumber(),
      firstName: entity.getFirstName(),
      lastName: entity.getLastName(),
      position: entity.getPosition(),
      contract: entity.getContract(),
      type: entity.getType(),
      dateOfEntry: entity.getDateOfEntry().toJSDate(),
      chargeNumber: entity.getChargeNumber(),
    };
  }
}
