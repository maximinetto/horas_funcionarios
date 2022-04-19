import CalculateForTAS from "@/services/calculations/classes/CalculateForTAS";
import calculateBalance, {
  calculateNextRowBalance,
  sanitize,
} from "./calculateBalance";
import { calculate } from "./calculateForMonth";
import expectBalance from "./expectBalance";
import { calculations, date, otherCalculations, year } from "./initialValues";
import { calculationRepository } from "./mock";
import { preset } from "./prepareData";
import { Result, Total } from "./types";

describe("Test calculations", () => {
  beforeEach(() => {
    calculationRepository.get.mockReset();
  });

  test("Should calculate right the passed values", async () => {
    calculationRepository.get.mockResolvedValue([]);
    let data = await preset(calculations, year, date);
    let total = calculate(calculations, data.lastBalances);
    await testGeneral(data, total);
    calculationRepository.get.mockReset();

    calculationRepository.get.mockResolvedValue(calculations);
    data = await preset(otherCalculations, year, date);
    total = calculate(
      [...calculations, ...otherCalculations],
      data.lastBalances
    );
    await testGeneral(data, {
      total: total.total,
      totalCurrentYear: total.totalCurrentYear,
    });
  });

  async function testGeneral(
    { lastBalances, data }: Result,
    {
      totalCurrentYear,
      total,
    }: { totalCurrentYear: Omit<Total, "totalHours">; total: Total }
  ) {
    const calculator = new CalculateForTAS(calculationRepository);

    const response = await calculator.calculate({
      ...data,
      hourlyBalances: [...lastBalances],
    });

    const expectedBalancesResult = calculateBalance({
      balances: [...lastBalances],
      discount: total.discount,
    });

    const expectedBalancesResultWithCurrentYear = calculateNextRowBalance(
      expectedBalancesResult.balances,
      totalCurrentYear
    );
    const expectedBalancesSanitized = sanitize(
      expectedBalancesResultWithCurrentYear
    );

    expect(response.simpleHours.value.toString()).toBe(
      totalCurrentYear.simple.toString()
    );
    expect(
      totalCurrentYear.working.equals(response.workingHours.value)
    ).toBeTruthy();
    expect(
      totalCurrentYear.nonWorking.equals(response.nonWorkingHours.value)
    ).toBeTruthy();
    expect(response.totalBalance.toString()).toBe(total.totalHours.toString());

    expectBalance(response.balances).toBe(
      expectedBalancesResultWithCurrentYear
    );
    expectBalance(response.balancesSanitized).toBe(expectedBalancesSanitized);
  }
});
