import { DateTime } from "luxon";

export type Official = {
  id: number;
  firstName: string;
  lastName: string;
  contract: Contract;
  type: TypeOfOfficial;
  position: string;
  dateOfEntry: Date;
  recordNumber: number;
  chargeNumber: number;
};

export type OfficialWithoutId = Omit<Official, "id">;

export interface OfficialWithOptionalId extends OfficialWithoutId {
  id?: number;
}
export interface OfficialSimple extends OfficialWithDifferentTypeAndContract {
  dateOfEntry: DateTime;
}
