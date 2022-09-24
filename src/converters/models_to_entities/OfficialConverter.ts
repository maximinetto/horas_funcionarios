import { DateTime } from "luxon";

import OfficialBuilder from "../../creators/official/OfficialBuilder";
import OfficialEntity from "../../entities/Official";
import { OfficialWithOptionalId } from "../../types/officials";
import { AbstractConverter } from "./AbstractConverter";

export default class OfficialConverter extends AbstractConverter<
  OfficialWithOptionalId,
  OfficialEntity
> {
  private _officialBuilder: OfficialBuilder;

  constructor({ officialBuilder }: { officialBuilder: OfficialBuilder }) {
    super();
    this._officialBuilder = officialBuilder;
  }

  fromModelToEntity(model: OfficialWithOptionalId): OfficialEntity {
    return this._officialBuilder.create({
      id: model.id,
      recordNumber: model.recordNumber,
      firstName: model.firstName,
      lastName: model.lastName,
      position: model.position,
      contract: model.contract,
      type: model.type,
      dateOfEntry: DateTime.fromJSDate(model.dateOfEntry),
      chargeNumber: model.chargeNumber,
    });
  }
  fromEntityToModel(entity: OfficialEntity): OfficialWithOptionalId {
    return {
      id: entity.id !== OfficialEntity.DEFAULTNUMBERID ? entity.id : undefined,
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
