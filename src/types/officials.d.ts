import { Official } from "@prisma/client";
import { DateTime } from "luxon";

export type OfficialWithoutId = Omit<Official, "id">;

export interface OfficialWithOptionalId extends OfficialWithoutId {
  id?: number;
}
export interface OfficialSimple extends Official {
  dateOfEntry: DateTime;
}
