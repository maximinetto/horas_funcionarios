import type Decimal from "decimal.js";

import {
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "@/@types/typeOfHours";
import BalanceConverter from "@/converters/BalanceConverter";
import { convertTypesOfYearsToActualBalance } from "@/converters/TypeOfYearToBalanceConverter";
import ActualBalance from "@/entities/ActualBalance";

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
    const currentActualBalance = convertTypesOfYearsToActualBalance(
      actualBalance,
      enrichBalances,
      totalBalance
    );

    return currentActualBalance;
  }

  create({
    totalBalance,
    officialId,
    balances,
  }: {
    balances: (TypeOfHoursByYearDecimal | TypeOfHoursByYear)[];
    officialId: number;
    totalBalance: Decimal;
  }) {
    const balancesSortedByYear = this.balancesSortedByYear(balances);
    const balanceNewer = this.getBalanceNewer(balancesSortedByYear);
    const nextYear = this.getNextYear(balanceNewer);

    this.actualHourlyBalanceCreator.create({
      balances: balancesSortedByYear,
      year: nextYear,
      total: totalBalance,
      officialId,
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
