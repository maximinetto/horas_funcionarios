import Decimal from "decimal.js";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import { generateRandomUUIDV4 } from "utils/strings";

import { removeHourlyBalancesWithZeroBalance } from "../HourlyBalanceRemover";

it("Should remove the hourly balances that start with balance 0", () => {
  const cases = [
    {
      hourlyBalances: [
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(0),
          working: new Decimal(0),
          nonWorking: new Decimal(0),
          year: 2019,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(0),
          working: new Decimal(0),
          nonWorking: new Decimal(0),
          year: 2020,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(60 * 60 * 1),
          working: new Decimal(0),
          nonWorking: new Decimal(0),
          year: 2021,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(60 * 60 * 0.5),
          working: new Decimal(60 * 60 * 5),
          nonWorking: new Decimal(60 * 60),
          year: 2022,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(0),
          working: new Decimal(0),
          nonWorking: new Decimal(0),
          year: 2023,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(60 * 60 * 5),
          working: new Decimal(60 * 60 * 0.05),
          nonWorking: new Decimal(0),
          year: 2024,
        }),
      ],
    },
    {
      hourlyBalances: [
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(60 * 60 * 1),
          working: new Decimal(0),
          nonWorking: new Decimal(0),
          year: 2021,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(60 * 60 * 0.5),
          working: new Decimal(60 * 60 * 5),
          nonWorking: new Decimal(60 * 60),
          year: 2022,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(0),
          working: new Decimal(0),
          nonWorking: new Decimal(0),
          year: 2023,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(60 * 60 * 5),
          working: new Decimal(60 * 60 * 0.05),
          nonWorking: new Decimal(0),
          year: 2024,
        }),
      ],
    },
    {
      hourlyBalances: [
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(60 * 60 * 1),
          working: new Decimal(0),
          nonWorking: new Decimal(0),
          year: 2021,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(0),
          working: new Decimal(0),
          nonWorking: new Decimal(0),
          year: 2022,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(60 * 60 * 3),
          working: new Decimal(0),
          nonWorking: new Decimal(0),
          year: 2023,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          simple: new Decimal(60 * 60 * 5),
          working: new Decimal(60 * 60 * 0.05),
          nonWorking: new Decimal(0),
          year: 2024,
        }),
      ],
    },
    {
      hourlyBalances: [
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(0),
          year: 2019,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(60 * 60),
          year: 2020,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(0),
          year: 2021,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(0),
          year: 2022,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(60 * 60 * 60),
          year: 2023,
        }),
      ],
    },
    {
      hourlyBalances: [
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(0),
          year: 2019,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(0),
          year: 2020,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(0),
          year: 2021,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(60 * 60 * 4),
          year: 2022,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(0),
          year: 2023,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(60 * 60 * 9),
          year: 2023,
        }),
      ],
    },
    {
      hourlyBalances: [
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(60 * 60 * 12),
          year: 2019,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(0),
          year: 2020,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(60 * 60 * 8),
          year: 2021,
        }),
        new HourlyBalanceTeacher({
          id: generateRandomUUIDV4(),
          balance: new Decimal(0),
          year: 2022,
        }),
      ],
    },
  ];

  const first = removeHourlyBalancesWithZeroBalance(cases[0].hourlyBalances);
  expect(first).toEqual(cases[0].hourlyBalances.slice(2));
  const second = removeHourlyBalancesWithZeroBalance(cases[1].hourlyBalances);
  expect(second).toEqual(cases[1].hourlyBalances.slice(0));
  const third = removeHourlyBalancesWithZeroBalance(cases[2].hourlyBalances);
  expect(third).toEqual(cases[2].hourlyBalances.slice(0));
  const four = removeHourlyBalancesWithZeroBalance(cases[3].hourlyBalances);
  expect(four).toEqual(cases[3].hourlyBalances.slice(1));
  const five = removeHourlyBalancesWithZeroBalance(cases[4].hourlyBalances);
  expect(five).toEqual(cases[4].hourlyBalances.slice(3));
  const six = removeHourlyBalancesWithZeroBalance(cases[5].hourlyBalances);
  expect(six).toEqual(cases[5].hourlyBalances.slice(0));
});
