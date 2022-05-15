import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import { TypeOfHour, TypeOfHoursByYearDecimal } from "@/@types/typeOfHours";
import { Decimal } from "decimal.js";
import Hours from "../../typeOfHours";
import { HourlyBalanceTASNotNullable, Total } from "./types";

export default function subtractHoursFromBalance(
  balances: HourlyBalanceTASNotNullable[],
  discount: Decimal
) {
  balances.sort(sort);

  const result: { year: number; hours: TypeOfHour[] }[] = [];

  balances.forEach((balance, index) => {
    const { year } = balance;
    const { simple, working, nonWorking } = balance.hourlyBalanceTAS;
    const calculatedBalance = calculateRow(
      { simple, working, nonWorking, year },
      discount,
      result
    );
    result.push(calculatedBalance);
  });

  const resultToBalance: HourlyBalanceTASNotNullable[] = result.map(
    (row, index) => {
      const { year, hours } = row;

      return {
        actualBalanceId: balances[index].actualBalanceId,
        year,
        id: balances[index].id,
        hourlyBalanceTAS: {
          simple: BigInt(hours[0].value.toString()),
          working: BigInt(hours[1].value.toString()),
          nonWorking: BigInt(hours[2].value.toString()),
          hourlyBalanceId: balances[index].hourlyBalanceTAS.hourlyBalanceId,
          id: balances[index].hourlyBalanceTAS.id,
        },
      };
    }
  );

  return {
    result,
    resultSanitized: sanitize(result),
    balances: resultToBalance,
    balancesSanitized: resultToBalance.map((b) => ({
      ...b,
      hourlyBalanceTAS: {
        ...b.hourlyBalanceTAS,
        simple: b.hourlyBalanceTAS.simple < 0 ? 0n : b.hourlyBalanceTAS.simple,
        working:
          b.hourlyBalanceTAS.working < 0 ? 0n : b.hourlyBalanceTAS.working,
        nonWorking:
          b.hourlyBalanceTAS.nonWorking < 0
            ? 0n
            : b.hourlyBalanceTAS.nonWorking,
      },
    })),
  };
}

export function sanitize(balances: TypeOfHoursByYearDecimal[]) {
  return balances.map((balance) => ({
    year: balance.year,
    hours: balance.hours.map((hour) => ({
      typeOfHour: hour.typeOfHour,
      value: hour.value.lessThan(0) ? new Decimal(0) : hour.value,
    })),
  }));
}

export function calculateNextRowBalance(
  year: number,
  totalCurrentYear: Omit<Total, "totalHours">,
  previousHour?: TypeOfHour
) {
  const simple: Decimal =
    previousHour && previousHour.value.lessThan(0)
      ? previousHour.value.plus(totalCurrentYear.simple)
      : totalCurrentYear.simple;
  const working: Decimal = simple.lessThan(0)
    ? simple.plus(totalCurrentYear.working)
    : totalCurrentYear.working;
  const nonWorking: Decimal = working.lessThan(0)
    ? working.plus(totalCurrentYear.nonWorking)
    : totalCurrentYear.nonWorking;
  return {
    year,
    hours: [
      {
        typeOfHour: Hours.simple,
        value: simple,
      },
      {
        typeOfHour: Hours.working,
        value: working,
      },
      {
        typeOfHour: Hours.nonWorking,
        value: nonWorking,
      },
    ],
  };
}

export function calculateTotalBalance(
  totalCurrentYear: Omit<Total, "totalHours">,
  lastBalances: HourlyBalanceTASNotNullable[]
) {
  const total: Total = {
    ...totalCurrentYear,
    totalHours: new Decimal(0),
  };

  lastBalances.forEach(({ hourlyBalanceTAS }) => {
    if (hourlyBalanceTAS) {
      total.simple = new Decimal(hourlyBalanceTAS.simple.toString()).add(
        total.simple
      );
      total.working = new Decimal(hourlyBalanceTAS.working.toString()).add(
        total.working
      );
      total.nonWorking = new Decimal(
        hourlyBalanceTAS.nonWorking.toString()
      ).add(total.nonWorking);
    } else {
      total.simple = new Decimal(0).add(total.simple);
      total.working = new Decimal(0).add(total.working);
      total.nonWorking = new Decimal(0).add(total.nonWorking);
    }
  });
  total.totalHours = new Decimal(total.working.toString())
    .add(total.nonWorking.toString())
    .add(total.simple.toString())
    .sub(total.discount.toString());

  return total;
}

function mapBalance(
  year: number,
  {
    simple,
    working,
    nonWorking,
  }: { simple: Decimal; working: Decimal; nonWorking: Decimal }
) {
  return {
    year,
    hours: [
      {
        typeOfHour: Hours.simple,
        value: simple,
      },
      {
        typeOfHour: Hours.working,
        value: working,
      },
      {
        typeOfHour: Hours.nonWorking,
        value: nonWorking,
      },
    ],
  };
}

function calculateRow(
  {
    year,
    simple,
    working,
    nonWorking,
  }: {
    year: number;
    simple: bigint;
    working: bigint;
    nonWorking: bigint;
  },
  discount: Decimal,
  accumulator: { year: number; hours: TypeOfHour[] }[]
) {
  const data = { simple, working, nonWorking, year };
  if (accumulator.length === 0) {
    return calculateFirstRowBalance(data, discount);
  }

  return lastCases(data, accumulator);
}

function sort(a: HourlyBalanceTAS, b: HourlyBalanceTAS): number {
  return a.year - b.year;
}

export function calculateFirstRowBalance(
  {
    year,
    simple: _simple,
    working: _working,
    nonWorking: _nonWorking,
  }: { simple: bigint; working: bigint; nonWorking: bigint; year: number },
  discount: Decimal
) {
  const simple = new Decimal(_simple.toString()).sub(discount);
  const _w = new Decimal(_working.toString());
  const working = simple.lessThan(0) ? _w.plus(simple) : _w;
  const _non = new Decimal(_nonWorking.toString());
  const nonWorking = working.lessThan(0) ? _non.plus(working) : _non;
  return mapBalance(year, { simple, working, nonWorking });
}

function lastCases(
  {
    year,
    simple: _simple,
    working: _working,
    nonWorking: _nonWorking,
  }: { simple: bigint; working: bigint; nonWorking: bigint; year: number },
  accumulator: { year: number; hours: TypeOfHour[] }[]
) {
  const lastTypeOfHour = accumulator[accumulator.length - 1];
  const previousHours = lastTypeOfHour.hours[lastTypeOfHour.hours.length - 1];
  let simple = new Decimal(_simple.toString());
  simple = previousHours.value.lessThan(0)
    ? simple.add(previousHours.value)
    : simple;

  let working = new Decimal(_working.toString());
  working = simple.lessThan(0) ? working.add(simple) : working;

  let nonWorking = new Decimal(_nonWorking.toString());
  nonWorking = working.lessThan(0) ? nonWorking.add(working) : nonWorking;
  return mapBalance(year, { simple, working, nonWorking });
}
