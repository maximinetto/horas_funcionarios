import ActualBalance from "entities/ActualBalance";
import type Entity from "entities/Entity";
import { Contract, TypeOfOfficial } from "enums/officials";
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
  insert?: boolean;
  actualBalances?: ActualBalance[];
}
