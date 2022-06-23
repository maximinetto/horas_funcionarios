import { Decimal } from "decimal.js";

import ActualBalance from "../ActualBalance";
import Nullable from "./Nullable";

export default class NullActualBalance
  extends ActualBalance
  implements Nullable
{
  public constructor(id?: string) {
    super(id ?? "", 2000, new Decimal(0));
  }

  public isDefault(): boolean {
    return true;
  }
}
