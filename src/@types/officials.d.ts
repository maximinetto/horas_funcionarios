import { Official } from "@prisma/client";
import { DateTime } from "luxon";

export type OfficialWithoutId = Omit<Official, "id">;
export interface OfficialSimple extends Official {
  dateOfEntry: DateTime;
}
