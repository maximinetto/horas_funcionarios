import { Decimal } from "decimal.js";

import HourlyBalanceTAS from "../../../../../entities/HourlyBalanceTAS";
import {
  TypeOfHourDecimal,
  TypeOfHoursByYearDecimal,
} from "../../../../../types/typeOfHours";
import Hours from "../../typeOfHours";
import { Total } from "./types";

export default function subtractHoursFromBalance(
  balances: HourlyBalanceTAS[],
  discount: Decimal
) {
  balances.sort(sort);

  const result: { year: number; hours: TypeOfHourDecimal[] }[] = [];

  balances.forEach((balance) => {
    const { year } = balance;
    const { simple, working, nonWorking } = balance;
    const calculatedBalance = calculateRow(
      { simple, working, nonWorking, year },
      discount,
      result
    );
    result.push(calculatedBalance);
  });

  const resultToBalance: HourlyBalanceTAS[] = result.map((row, index) => {
    const { year, hours } = row;
    const simple = hours[0].value;
    const working = hours[1].value;
    const nonWorking = hours[2].value;
    return new HourlyBalanceTAS({
      id: balances[index].id,
      year,
      working,
      nonWorking,
      simple,
      actualBalance: balances[index].actualBalance,
    });
  });

  return {
    result,
    resultSanitized: sanitize(result),
    balances: resultToBalance,
    balancesSanitized: resultToBalance.map((b) => {
      const simple = b.simple.greaterThanOrEqualTo(0)
        ? b.working
        : new Decimal("0");
      const working = b.working.greaterThanOrEqualTo(0)
        ? b.working
        : new Decimal("0");
      const nonWorking = b.nonWorking.greaterThanOrEqualTo(0)
        ? b.working
        : new Decimal("0");

      return new HourlyBalanceTAS({
        id: b.id,
        year: b.year,
        working,
        nonWorking,
        simple,
        actualBalance: b.actualBalance,
      });
    }),
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
  previousHour?: TypeOfHourDecimal
) {
  const simple: Decimal =
    previousHour && previousHour.value.greaterThan(0)
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
  lastBalances: HourlyBalanceTAS[]
) {
  const total: Total = {
    ...totalCurrentYear,
    totalHours: new Decimal(0),
  };

  lastBalances.forEach(({ simple, working, nonWorking }) => {
    total.simple = new Decimal(simple.toString()).add(total.simple);
    total.working = new Decimal(working.toString()).add(total.working);
    total.nonWorking = new Decimal(nonWorking.toString()).add(total.nonWorking);
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
    simple: Decimal;
    working: Decimal;
    nonWorking: Decimal;
  },
  discount: Decimal,
  accumulator: { year: number; hours: TypeOfHourDecimal[] }[]
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
  }: { simple: Decimal; working: Decimal; nonWorking: Decimal; year: number },
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
  }: { simple: Decimal; working: Decimal; nonWorking: Decimal; year: number },
  accumulator: { year: number; hours: TypeOfHourDecimal[] }[]
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
