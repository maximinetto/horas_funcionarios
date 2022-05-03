import {
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "@/@types/typeOfHours";
import BalanceConverter from "@/converters/BalanceConverter";
import { convertTypesOfYearsToActualBalance } from "@/converters/TypeOfYearToBalanceConverter";
import { HourlyBalance, HourlyBalanceTAS } from "@prisma/client";
import ActualHourlyBalanceCreator from "./ActualHourlyBalanceCreator";

export default class ActualHourlyBalanceReplacer {
  private balanceConverter: BalanceConverter;
  private actualBalanceCreator: ActualHourlyBalanceCreator;

  constructor(
    balanceConverter: BalanceConverter,
    actualBalanceCreator: ActualHourlyBalanceCreator
  ) {
    this.balanceConverter = balanceConverter;
    this.actualBalanceCreator = actualBalanceCreator;
  }

  replace({
    actualBalance,
    balances,
    totalBalance,
  }: {
    balances: (TypeOfHoursByYearDecimal | TypeOfHoursByYear)[];
    totalBalance: bigint;
    actualBalance: {
      hourlyBalances: (HourlyBalance & {
        hourlyBalanceTAS: HourlyBalanceTAS | null;
      })[];
      id: string;
      year: number;
      total: bigint;
      officialId: number;
    };
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
    totalBalance: bigint;
  }) {
    const balancesSortedByYear = this.balancesSortedByYear(balances);
    const balanceNewer = this.getBalanceNewer(balancesSortedByYear);
    const nextYear = this.getNextYear(balanceNewer);

    this.actualBalanceCreator.create({
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
