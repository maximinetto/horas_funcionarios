import { TypeOfHoursByYear } from "@/@types/typeOfHours";
import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import { HourlyBalance, HourlyBalanceTAS } from "@prisma/client";
import { generateRandomUUIDV4 } from "../calculations/classes/tests/CalculateForTAS/util";

export default class ActualHourlyBalanceCreator {
  create({
    year,
    total,
    officialId,
    balances,
  }: {
    year: number;
    total: bigint;
    officialId: number;
    balances: TypeOfHoursByYear[];
  }): {
    hourlyBalances: (HourlyBalance & {
      hourlyBalanceTAS: HourlyBalanceTAS | null;
    })[];
    id: string;
    year: number;
    total: bigint;
    officialId: number;
  } {
    const id = generateRandomUUIDV4();

    return {
      id,
      year,
      total,
      officialId,
      hourlyBalances: balances.map((b) => {
        const hourlyBalanceId = generateRandomUUIDV4();
        return {
          actualBalanceId: id,
          id: hourlyBalanceId,
          year: b.year,
          hourlyBalanceTAS: {
            id: generateRandomUUIDV4(),
            simple: BigInt(
              b.hours
                .find((h) => h.typeOfHour === TYPES_OF_HOURS.simple)
                ?.value.toString() || 0n
            ),
            working: BigInt(
              b.hours
                .find((h) => h.typeOfHour === TYPES_OF_HOURS.working)
                ?.value.toString() || 0n
            ),
            nonWorking: BigInt(
              b.hours
                .find((h) => h.typeOfHour === TYPES_OF_HOURS.nonWorking)
                ?.value.toString() || 0n
            ),
            hourlyBalanceId,
          },
        };
      }),
    };
  }
}
