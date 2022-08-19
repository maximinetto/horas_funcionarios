import ActualBalance from "entities/ActualBalance";

import ActualBalanceModel from "./types";

export default interface ActualHourlyBalanceBuilder {
  create(actualBalance: ActualBalanceModel): ActualBalance;
}
