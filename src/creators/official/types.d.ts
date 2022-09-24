import { DateTime } from "luxon";

import ActualBalance from "../../entities/ActualBalance";
import type Entity from "../../entities/Entity";
import { Contract, TypeOfOfficial } from "../../enums/officials";

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
