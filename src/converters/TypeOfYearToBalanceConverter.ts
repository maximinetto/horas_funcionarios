import { TypeOfHoursByYearDecimal } from "@/@types/typeOfHours";
import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import { instance as hours } from "@/services/calculations/classes/typeOfHours";
import { HourlyBalance, HourlyBalanceTAS } from "@prisma/client";

export function convertTypesOfYearsToActualBalance(
  actualBalance: {
    hourlyBalances: (HourlyBalance & {
      hourlyBalanceTAS: HourlyBalanceTAS | null;
    })[];
    id: string;
    year: number;
    total: bigint;
    officialId: number;
  },
  balances: TypeOfHoursByYearDecimal[],
  total: bigint
): {
  hourlyBalances: (HourlyBalance & {
    hourlyBalanceTAS: HourlyBalanceTAS | null;
  })[];
  id: string;
  year: number;
  total: bigint;
  officialId: number;
} {
  const hourlyBalances = actualBalance.hourlyBalances.map((h) => {
    const current = balances.find((b) => b.year === h.year);

    if (!current) {
      throw new Error("No current balance");
    }
    const simple = BigInt(
      current.hours
        .find((h) => hours.isFirstTypeOfHour(h.typeOfHour))
        ?.value.toString() || 0n
    );
    const working = BigInt(
      current.hours
        .find((h) => h.typeOfHour === TYPES_OF_HOURS.working)
        ?.value.toString() || 0n
    );
    const nonWorking = BigInt(
      current.hours
        .find((h) => h.typeOfHour === TYPES_OF_HOURS.nonWorking)
        ?.value.toString() || 0n
    );

    const hourlyBalanceTAS: HourlyBalanceTAS | null = h.hourlyBalanceTAS
      ? {
          ...h.hourlyBalanceTAS,
          simple,
          working,
          nonWorking,
        }
      : null;

    return { ...h, hourlyBalanceTAS };
  });

  const { hourlyBalances: h, ...others } = actualBalance;

  return {
    ...others,
    total,
    hourlyBalances,
  };
}
