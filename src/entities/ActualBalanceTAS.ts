import { Collection } from "@mikro-orm/core";
import { Decimal } from "decimal.js";
import { TypeOfOfficial } from "enums/officials";

import ActualBalance from "./ActualBalance";
import CalculationTAS from "./CalculationTAS";
import HourlyBalanceTAS from "./HourlyBalanceTAS";
import Official from "./Official";

export default class ActualBalanceTAS extends ActualBalance {
  calculations = new Collection<CalculationTAS>(this);
  hourlyBalances = new Collection<HourlyBalanceTAS>(this);

  public constructor({
    id,
    year,
    total,
    official,
    calculations,
    hourlyBalances,
  }: {
    id?: string;
    year: number;
    total?: Decimal;
    official?: Official;
    calculations?: CalculationTAS[];
    hourlyBalances?: HourlyBalanceTAS[];
  }) {
    super({
      id,
      year,
      type: TypeOfOfficial.TAS,
      total,
      official,
    });

    this.calculations = new Collection<CalculationTAS>(this, calculations);
    this.hourlyBalances = new Collection<HourlyBalanceTAS>(
      this,
      hourlyBalances
    );
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
