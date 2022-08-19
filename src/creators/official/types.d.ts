import { Contract, TypeOfOfficials } from "@prisma/client";
import type Entity from "entities/Entity";
import { DateTime } from "luxon";

export interface OfficialModel extends Entity {
  id?: number;
  recordNumber: number;
  firstName: string;
  lastName: string;
  position: string;
  contract: Contract;
  type: TypeOfOfficials;
  dateOfEntry: DateTime;
  chargeNumber: number;
  actualBalances?: ActualBalance[];
}
