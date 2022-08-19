import BalanceConverter from "converters/models_to_entities/BalanceConverter";
import { convertTypesOfYearsToActualBalance } from "converters/models_to_entities/TypeOfYearToBalanceConverter";
import type Decimal from "decimal.js";
import ActualBalance from "entities/ActualBalance";
import { TypeOfOfficial } from "entities/Official";
import { TypeOfHoursByYear, TypeOfHoursByYearDecimal } from "types/typeOfHours";

import ActualHourlyBalanceCreator from "./ActualHourlyBalanceCreator";

export default class ActualHourlyBalanceReplacer {
  private balanceConverter: BalanceConverter;
  private actualHourlyBalanceCreator: ActualHourlyBalanceCreator;

  constructor({
    actualHourlyBalanceCreator,
    balanceConverter,
  }: {
    balanceConverter: BalanceConverter;
    actualHourlyBalanceCreator: ActualHourlyBalanceCreator;
  }) {
    this.balanceConverter = balanceConverter;
    this.actualHourlyBalanceCreator = actualHourlyBalanceCreator;
  }

  replace({
    actualBalance,
    balances,
    totalBalance,
  }: {
    balances: (TypeOfHoursByYearDecimal | TypeOfHoursByYear)[];
    totalBalance: Decimal;
    actualBalance: ActualBalance;
  }) {
    const enrichBalances = this.balanceConverter.fromBigIntToDecimal(balances);
    return convertTypesOfYearsToActualBalance(
      actualBalance,
      enrichBalances,
      totalBalance
    );
  }

  create({
    totalBalance,
    officialId,
    balances,
    type,
  }: {
    balances: (TypeOfHoursByYearDecimal | TypeOfHoursByYear)[];
    officialId: number;
    totalBalance: Decimal;
    type: TypeOfOfficial;
  }) {
    const balancesSortedByYear = this.balancesSortedByYear(balances);
    const balanceNewer = this.getBalanceNewer(balancesSortedByYear);
    const nextYear = this.getNextYear(balanceNewer);

    this.actualHourlyBalanceCreator.create({
      balances: balancesSortedByYear,
      year: nextYear,
      total: totalBalance,
      officialId,
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

  private balancesSortedByYear(
    balances: (TypeOfHoursByYearDecimal | TypeOfHoursByYear)[]
  ) {
    return balances.sort((a, b) => a.year - b.year);
  }
}
