import {
  Calculation as CalculationModel,
  CalculationTAS as CalculationTASModel,
  CalculationTeacher,
  Prisma,
} from "@prisma/client";
import Decimal from "decimal.js";

import Calculation from "entities/Calculation";
import CalculationTASEntity from "entities/CalculationTAS";
import Official from "entities/Official";

import {
  TypeOfHourDecimal,
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "./typeOfHours";

export type CalculationWithTAS = Prisma.CalculationGetPayload<{
  include: { calculationTAS: true };
}>;

export interface NotNullableCalculationWithTAS extends CalculationWithTAS {
  calculationTAS: CalculationTASModel;
}
export type CalculationWithTeacher = Prisma.CalculationGetPayload<{
  include: { calculationTeacher: true };
}>;

export interface NotNullableCalculationWithTeacher
  extends CalculationWithTeacher {
  calculationTeacher: CalculationTeacher;
}

export interface CalculationParam<T extends Calculation> {
  calculations: Calculations<T>;
  year: number;
  official: Official;
  hourlyBalances: HourlyBalance[];
  calculationsFromPersistence: Calculations<T>;
}

export interface CalculationTAS extends CalculationModel, CalculationTASModel {}
export interface CalculationTeacher
  extends CalculationModel,
    CalculationTeacher {}

export interface CalculationParamTAS extends CalculationParam {
  calculations: CalculationTASEntity[];
}

export interface PrismaCalculationFinderOptions
  extends Partial<Prisma.CalculationFindUniqueArgs> {}

export type CalculationCalculated = {
  calculations: CalculationTASEntity[];
  totalBalance: Decimal;
  totalWorkingHours: TypeOfHourDecimal;
  totalNonWorkingHours: TypeOfHourDecimal;
  totalSimpleHours: TypeOfHourDecimal;
  totalDiscount: Decimal;
  balances: TypeOfHoursByYear[];
  balancesSanitized: TypeOfHoursByYearDecimal[];
};
