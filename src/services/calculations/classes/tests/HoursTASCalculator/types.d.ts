import Decimal from "decimal.js";

import Calculations from "../../../../../collections/Calculations";
import ActualBalance from "../../../../../entities/ActualBalance";
import CalculationTAS from "../../../../../entities/CalculationTAS";
import HourlyBalanceTAS from "../../../../../entities/HourlyBalanceTAS";
import Official from "../../../../../entities/Official";
import { TYPES_OF_HOURS } from "../../../../../enums/typeOfHours";
import { TypeOfHour } from "../../../../../types/typeOfHours";

export type Data = {
  calculations: Calculations<CalculationTAS>;
  official: Official;
  year: number;
};
export interface HourlyBalanceTASNotNullable extends HourlyBalanceTAS {
  hourlyBalanceTAS: NonNullable<HourlyBalanceTAS>;
}

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
  balances: HourlyBalanceTAS[];
  balancesSanitized: HourlyBalanceTAS[];
  actualBalance: ActualBalance;
};
