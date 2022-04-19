import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import { TypeOfHour, TypeOfHoursByYearDecimal } from "@/@types/typeOfHours";
import Decimal from "decimal.js";
import Hours from "../../typeOfHours";
import { Total } from "./types";

export default function calculateBalance({
  balances,
  discount,
}: {
  balances: HourlyBalanceTAS[];
  discount: Decimal;
}) {
  balances.sort(sort);

  const result: { year: number; hours: TypeOfHour[] }[] = [];

  balances.forEach((balance, index) => {
    const calculatedBalance = calculateRow(balance, discount, index, result);
    if (calculatedBalance) {
      result.push(calculatedBalance);
    }
  });

  return {
    balances: result,
    balancesSanitized: sanitize(result),
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
  balances: TypeOfHoursByYearDecimal[],
  totalCurrentYear: Omit<Total, "totalHours">
) {
  const result = [...balances];
  const lastBalance = result[result.length - 1];
  const lastYear = lastBalance.year + 1;
  let previousHours = lastBalance.hours.find(
    ({ typeOfHour }) => typeOfHour === Hours.simple
  );
  if (!previousHours) {
    throw new Error("Test failed");
  }
  const simple: Decimal = previousHours.value.lessThan(0)
    ? previousHours.value.plus(totalCurrentYear.simple)
    : totalCurrentYear.simple;
  const working: Decimal = simple.lessThan(0)
    ? simple.plus(totalCurrentYear.working)
    : totalCurrentYear.working;
  const nonWorking: Decimal = working.lessThan(0)
    ? working.plus(totalCurrentYear.nonWorking)
    : totalCurrentYear.nonWorking;
  result.push({
    year: lastYear,
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
  });

  return result;
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
  balance: HourlyBalanceTAS,
  discount: Decimal,
  index: number,
  accumulator: { year: number; hours: TypeOfHour[] }[]
) {
  if (index === 0) {
    return firstCase(balance, discount);
  }

  return lastCases(balance, accumulator);
}

function sort(a: HourlyBalanceTAS, b: HourlyBalanceTAS): number {
  return a.year - b.year;
}

function firstCase(balance: HourlyBalanceTAS, discount: Decimal) {
  const simple = new Decimal(
    balance.hourlyBalanceTAS ? balance.hourlyBalanceTAS.simple.toString() : 0
  ).sub(discount);
  const _w = new Decimal(
    balance.hourlyBalanceTAS ? balance.hourlyBalanceTAS.working.toString() : 0
  );
  const working = simple.lessThan(0) ? _w.plus(simple) : _w;
  const _non = new Decimal(
    balance.hourlyBalanceTAS
      ? balance.hourlyBalanceTAS.nonWorking.toString()
      : 0
  );
  const nonWorking = working.lessThan(0) ? _non.plus(working) : _non;
  return mapBalance(balance.year, { simple, working, nonWorking });
}

function lastCases(
  balance: HourlyBalanceTAS,
  accumulator: { year: number; hours: TypeOfHour[] }[]
) {
  const lastTypeOfHour = accumulator[accumulator.length - 1];
  const previousHours = lastTypeOfHour.hours[lastTypeOfHour.hours.length - 1];
  let simple = new Decimal(
    balance.hourlyBalanceTAS ? balance.hourlyBalanceTAS.simple.toString() : 0
  );
  simple = previousHours.value.lessThan(0)
    ? simple.add(previousHours.value)
    : simple;

  let working = new Decimal(
    balance.hourlyBalanceTAS ? balance.hourlyBalanceTAS.working.toString() : 0
  );
  working = simple.lessThan(0) ? working.add(simple) : working;

  let nonWorking = new Decimal(
    balance.hourlyBalanceTAS
      ? balance.hourlyBalanceTAS.nonWorking.toString()
      : 0
  );
  nonWorking = working.lessThan(0) ? nonWorking.add(working) : nonWorking;
  return mapBalance(balance.year, { simple, working, nonWorking });
}
