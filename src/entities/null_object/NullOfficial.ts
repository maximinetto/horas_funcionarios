import { Contract, TypeOfOfficial } from "enums/officials";
import { DateTime } from "luxon";

import Official from "../Official";
import Nullable from "./Nullable";

export default class NullOfficial extends Official implements Nullable {
  public constructor() {
    super({
      id: 0,
      chargeNumber: 0,
      firstName: "",
      lastName: "",
      position: "",
      contract: Contract.PERMANENT,
      type: TypeOfOfficial.TAS,
      dateOfEntry: DateTime.now(),
      recordNumber: 0,
      actualBalances: [],
    });
  }

  public isDefault(): boolean {
    return true;
  }
}
