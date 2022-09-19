import Decimal from "decimal.js";

export function convertDecimalToHHmm(real: number | bigint | string): string {
  if (typeof real === "number") {
    const integer = Math.floor(real);
    const decimal = Number((real - integer).toFixed(2));
    const minutes = (Math.ceil(decimal * 60) + "").padStart(2, "0");
    return integer + ":" + minutes;
  }

  const decimal = new Decimal(real.toString());
  const integer = decimal.floor();
  const decimalPart = new Decimal(decimal.sub(integer));
  const minutes = decimalPart.mul(60).ceil().toString().padStart(2, "0");
  return integer + ":" + minutes;
}

export function convertHHmmToDecimal(input: string): number {
  const arr = input.split(":");
  const decimal = Number(arr[1]) / 60;
  const integer = Number(arr[0]);
  return integer + decimal;
}
