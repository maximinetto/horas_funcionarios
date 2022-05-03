import { ActualBalanceDTO } from "@/@types/actualBalance";
import { CalculationTAS } from "@/@types/calculations";
import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import { TypeOfOfficials } from "@prisma/client";

export type Data = {
  actualDate: Date;
  calculations: CalculationTAS[];
  official: {
    id: number;
    recordNumber: number;
    firstName: string;
    lastName: string;
    position: string;
    contract: Contract;
    type: TypeOfOfficials;
    dateOfEntry: Date;
    chargeNumber: number;
  };
  year: number;
};
export interface HourlyBalanceTASNotNullable extends HourlyBalanceTAS {
  hourlyBalanceTAS: NonNullable<HourlyBalanceTAS["hourlyBalanceTAS"]>;
}

export interface Result {
  data: Data;
  lastBalances: HourlyBalanceTASNotNullable[];
}

export type Total = {
  simple: Decimal;
  nonWorking: Decimal;
  working: Decimal;
  totalHours: Decimal;
  discount: Decimal;
};

export type CalculationData = {
  result: {
    year: number;
    hours: TypeOfHour[];
  }[];
  resultSanitized: {
    year: number;
    hours: {
      typeOfHour: TYPES_OF_HOURS;
      value: Decimal;
    }[];
  }[];
  balances: HourlyBalanceTASNotNullable[];
  balancesSanitized: {
    hourlyBalanceTAS: {
      simple: bigint;
      working: bigint;
      nonWorking: bigint;
      id: string;
      hourlyBalanceId: string;
    };
    id: string;
    year: number;
    actualBalanceId: string;
  }[];
  actualBalance: ActualBalanceDTO;
};
