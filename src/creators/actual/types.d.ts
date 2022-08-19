import Decimal from "decimal.js";
import Calculation from "entities/Calculation";
import type Entity from "entities/Entity";
import HourlyBalance from "entities/HourlyBalance";
import Official, { TypeOfOfficial } from "entities/Official";

export default interface ActualBalance extends Entity {
  id: string;
  year: number;
  total: Decimal;
  official?: Official;
  type: TypeOfOfficial;
  calculations?: Calculation[];
  hourlyBalances?: HourlyBalance[];
}
