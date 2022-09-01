import type Entity from "entities/Entity";
import { Contract, TypeOfOfficial } from "entities/Official";
import { DateTime } from "luxon";

export interface OfficialModel extends Entity {
  id?: number;
  recordNumber: number;
  firstName: string;
  lastName: string;
  position: string;
  contract: Contract;
  type: TypeOfOfficial;
  dateOfEntry: DateTime;
  chargeNumber: number;
  actualBalances?: ActualBalance[];
}
