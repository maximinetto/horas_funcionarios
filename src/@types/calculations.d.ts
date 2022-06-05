import Calculation from "@/entities/Calculation";
import CalculationTASEntity from "@/entities/CalculationTAS";
import Official from "@/entities/Official";
import {
  Calculation as CalculationModel,
  CalculationTAS as CalculationTASModel,
  CalculationTeacher,
  Prisma,
} from "@prisma/client";
import Decimal from "decimal.js";
import {
  TypeOfHourDecimal,
  TypeOfHoursByYear,
  TypeOfHoursByYearDecimal,
} from "./typeOfHours";

type Seconds = number | bigInt;

interface CalculationTASData
  extends Omit<CalculationModel, "id">,
    Omit<CalculationTASModel, "calculationId" | "id"> {}
interface CalculationTeacherData
  extends Omit<CalculationModel, "id">,
    Omit<CalculationTeacher, "calculationId" | "id"> {}

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

export interface CalculationParam {
  calculations: Calculation[];
  calculationsFromPersistence: Calculation[];
  year: number;
  official: Official;
  hourlyBalances: HourlyBalance[];
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
