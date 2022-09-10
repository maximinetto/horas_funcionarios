import { Collection } from "@mikro-orm/core";
import { Decimal } from "decimal.js";
import { TypeOfOfficial } from "enums/officials";

import ActualBalance from "./ActualBalance";
import CalculationTeacher from "./CalculationTeacher";
import HourlyBalanceTeacher from "./HourlyBalanceTeacher";
import Official from "./Official";

export default class ActualBalanceTeacher extends ActualBalance {
  calculations = new Collection<CalculationTeacher>(this);
  hourlyBalances = new Collection<HourlyBalanceTeacher>(this);

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
    calculations?: CalculationTeacher[];
    hourlyBalances?: HourlyBalanceTeacher[];
  }) {
    super({
      id,
      year,
      type: TypeOfOfficial.TEACHER,
      total,
      official,
    });

    this.calculations = new Collection<CalculationTeacher>(this, calculations);
    this.hourlyBalances = new Collection<HourlyBalanceTeacher>(
      this,
      hourlyBalances
    );
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
