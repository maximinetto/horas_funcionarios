import { Decimal } from "decimal.js";

import ActualBalance from "../ActualBalanceTeacher";
import Nullable from "./Nullable";

export default class NullActualBalance
  extends ActualBalance
  implements Nullable
{
  public constructor(id?: string) {
    super({ id: id ?? "", year: 2000, total: new Decimal(0) });
  }

  public isDefault(): boolean {
    return true;
  }
}
