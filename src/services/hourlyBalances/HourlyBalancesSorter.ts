export default function sort<
  T extends {
    year: number;
  }
>(hourlyBalances: T[]): T[] {
  return hourlyBalances.slice().sort((h1, h2) => h1.year - h2.year);
}
