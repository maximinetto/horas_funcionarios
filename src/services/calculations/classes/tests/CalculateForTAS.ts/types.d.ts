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

export interface Result {
  data: Data;
  lastBalances: HourlyBalanceTAS[];
}

export type Total = {
  simple: Decimal;
  nonWorking: Decimal;
  working: Decimal;
  totalHours: Decimal;
  discount: Decimal;
};
