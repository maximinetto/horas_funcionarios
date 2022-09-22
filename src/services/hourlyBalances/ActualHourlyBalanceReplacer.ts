import BalanceConverter from "converters/models_to_entities/BalanceConverter";
import TypeOfYearToBalanceConverter from "converters/models_to_entities/TypeOfYearToBalanceConverter";
import type Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import Calculation from "entities/Calculation";
import Official from "entities/Official";
import { TypeOfOfficial } from "enums/officials";
import { TypeOfHoursByYear, TypeOfHoursByYearDecimal } from "types/typeOfHours";

import ActualHourlyBalanceCreator from "./ActualHourlyBalanceCreator";
import sort from "./HourlyBalancesSorter";

export default class ActualHourlyBalanceReplacer {
  private balanceConverter: BalanceConverter;
  private actualHourlyBalanceCreator: ActualHourlyBalanceCreator;
  private _typeOfYearToBalanceConverter: TypeOfYearToBalanceConverter;

  constructor({
    actualHourlyBalanceCreator,
    balanceConverter,
    typeOfYearToBalanceConverter,
  }: {
    balanceConverter: BalanceConverter;
    actualHourlyBalanceCreator: ActualHourlyBalanceCreator;
    typeOfYearToBalanceConverter: TypeOfYearToBalanceConverter;
  }) {
    this.balanceConverter = balanceConverter;
    this.actualHourlyBalanceCreator = actualHourlyBalanceCreator;
    this._typeOfYearToBalanceConverter = typeOfYearToBalanceConverter;
  }

  replace({
    actualBalance,
    balances,
    totalBalance,
    calculations,
    official,
  }: {
    balances: (TypeOfHoursByYearDecimal | TypeOfHoursByYear)[];
    totalBalance: Decimal;
    actualBalance: ActualBalance;
    calculations: Calculation[];
    official: Official;
  }) {
    const enrichBalances = this.balanceConverter.fromBigIntToDecimal(balances);
    return this._typeOfYearToBalanceConverter.convertToActualBalance({
      actualBalance,
      balances: enrichBalances,
      total: totalBalance,
      calculations,
      official,
    });
  }

  create({
    totalBalance,
    official,
    balances,
    type,
  }: {
    balances: (TypeOfHoursByYearDecimal | TypeOfHoursByYear)[];
    official: Official;
    totalBalance: Decimal;
    type: TypeOfOfficial;
  }) {
    const balancesSortedByYear = sort(balances);
    const balanceNewer = this.getBalanceNewer(balancesSortedByYear);
    const nextYear = this.getNextYear(balanceNewer);

    this.actualHourlyBalanceCreator.create({
      balances: balancesSortedByYear,
      year: nextYear,
      total: totalBalance,
      official,
      calculations: [],
      type,
    });
  }

  private getBalanceNewer(
    balancesSorted: (TypeOfHoursByYearDecimal | TypeOfHoursByYear)[]
  ): TypeOfHoursByYearDecimal | TypeOfHoursByYear {
    return balancesSorted[balancesSorted.length - 1];
  }

  private getNextYear(
    balanceNewer: TypeOfHoursByYearDecimal | TypeOfHoursByYear
  ) {
    return balanceNewer.year + 1;
  }
}
