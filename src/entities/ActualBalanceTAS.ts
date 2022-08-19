import { Collection } from "@mikro-orm/core";
import { Decimal } from "decimal.js";

import ActualBalance from "./ActualBalance";
import CalculationTAS from "./CalculationTAS";
import HourlyBalanceTAS from "./HourlyBalanceTAS";
import Official from "./Official";

export default class ActualBalanceTAS extends ActualBalance {
  private _calculations = new Collection<CalculationTAS>(this);
  private _hourlyBalances = new Collection<HourlyBalanceTAS>(this);

  public constructor({
    id,
    year,
    total,
    official,
    calculations,
    hourlyBalances,
  }: {
    id: string;
    year: number;
    total?: Decimal;
    official?: Official;
    calculations?: CalculationTAS[];
    hourlyBalances?: HourlyBalanceTAS[];
  }) {
    super({
      id,
      year,
      type: "tas",
      total,
      official,
    });

    this._calculations = new Collection<CalculationTAS>(this, calculations);
    this._hourlyBalances = new Collection<HourlyBalanceTAS>(
      this,
      hourlyBalances
    );
  }

  public get calculations(): Collection<CalculationTAS> {
    return this._calculations;
  }

  public set calculations(value: Collection<CalculationTAS>) {
    this._calculations = value;
  }

  public get hourlyBalances(): Collection<HourlyBalanceTAS> {
    return this._hourlyBalances;
  }

  public set hourlyBalances(value: Collection<HourlyBalanceTAS>) {
    this._hourlyBalances = value;
  }

  public getCalculations(): CalculationTAS[] {
    return this.calculations.getItems();
  }

  public setCalculations(value: CalculationTAS[]) {
    this.calculations = new Collection<CalculationTAS>(this, value);
  }

  getHourlyBalances(): HourlyBalanceTAS[] {
    return this.hourlyBalances.getItems();
  }

  setHourlyBalances(value: HourlyBalanceTAS[]): void {
    this.hourlyBalances = new Collection<HourlyBalanceTAS>(this, value);
  }

  public static isActualBalanceTAS(
    actualBalance: ActualBalance
  ): actualBalance is ActualBalanceTAS {
    return actualBalance instanceof ActualBalanceTAS;
  }
}
