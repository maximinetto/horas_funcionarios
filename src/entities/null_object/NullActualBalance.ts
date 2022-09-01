import { Decimal } from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";
import HourlyBalance from "entities/HourlyBalance";
import { TypeOfOfficial } from "entities/Official";
import UnexpectedError from "errors/UnexpectedError";

import Nullable from "./Nullable";

export default class NullActualBalance
  extends ActualBalance
  implements Nullable
{
  public constructor(id?: string) {
    super({
      id: id ?? "",
      year: 2000,
      total: new Decimal(0),
      type: TypeOfOfficial.TAS,
    });
  }

  public getCalculations(): CalculationTAS[] {
    throw new UnexpectedError("Not implemented");
  }

  setCalculations(_value: Calculation[]): void {
    throw new UnexpectedError("Method not implemented.");
  }
  getHourlyBalances(): HourlyBalance[] {
    throw new UnexpectedError("Method not implemented.");
  }
  setHourlyBalances(_value: HourlyBalance[]): void {
    throw new UnexpectedError("Method not implemented.");
  }

  public isDefault(): boolean {
    return true;
  }
}
