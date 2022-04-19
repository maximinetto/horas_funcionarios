import Decimal from "decimal.js";
import ActualBalance from "../ActualBalance";

export default class NullActualBalance extends ActualBalance {
  public constructor(id?: string) {
    super(id ?? "", 2000, new Decimal(0));
  }
}
