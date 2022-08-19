import { Collection } from "@mikro-orm/core";
import { Decimal } from "decimal.js";

import ActualBalance from "./ActualBalance";
import CalculationTeacher from "./CalculationTeacher";
import HourlyBalanceTeacher from "./HourlyBalanceTeacher";
import Official from "./Official";

export default class ActualBalanceTeacher extends ActualBalance {
  private _calculations = new Collection<CalculationTeacher>(this);
  private _hourlyBalances = new Collection<HourlyBalanceTeacher>(this);

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
    calculations?: CalculationTeacher[];
    hourlyBalances?: HourlyBalanceTeacher[];
  }) {
    super({
      id,
      year,
      type: "teacher",
      total,
      official,
    });

    this._calculations = new Collection<CalculationTeacher>(this, calculations);
    this._hourlyBalances = new Collection<HourlyBalanceTeacher>(
      this,
      hourlyBalances
    );
  }

  public get calculations(): Collection<CalculationTeacher> {
    return this._calculations;
  }

  public set calculations(value: Collection<CalculationTeacher>) {
    this._calculations = value;
  }

  public get hourlyBalances(): Collection<HourlyBalanceTeacher> {
    return this._hourlyBalances;
  }

  public set hourlyBalances(value: Collection<HourlyBalanceTeacher>) {
    this._hourlyBalances = value;
  }

  public getCalculations(): CalculationTeacher[] {
    return this.calculations.getItems();
  }

  public setCalculations(value: CalculationTeacher[]) {
    this.calculations = new Collection<CalculationTeacher>(this, value);
  }

  getHourlyBalances(): HourlyBalanceTeacher[] {
    return this.hourlyBalances.getItems();
  }

  setHourlyBalances(value: HourlyBalanceTeacher[]): void {
    this.hourlyBalances = new Collection<HourlyBalanceTeacher>(this, value);
  }

  public static isActualBalanceTeacher(
    actualBalance: ActualBalance
  ): actualBalance is ActualBalanceTeacher {
    return actualBalance instanceof ActualBalanceTeacher;
  }
}
