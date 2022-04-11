export function convertDecimalToHHmm(real: number): string {
  const integer = Math.floor(real);
  const decimal = Number((real - integer).toFixed(2));
  const minutes = (Math.ceil(decimal * 60) + "").padStart(2, "0");
  return integer + ":" + minutes;
}

export function convertHHmmToDecimal(input: string): number {
  const arr = input.split(":");
  const decimal = Number(arr[1]) / 60;
  const integer = Number(arr[0]);
  return integer + decimal;
}
