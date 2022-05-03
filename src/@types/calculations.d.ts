import { TYPES_OF_HOURS } from "@/enums/typeOfHours";
import {
  Calculation,
  CalculationTAS as CalculationTASModel,
  CalculationTeacher,
  Official,
  Prisma,
} from "@prisma/client";
import { TypeOfHoursByYear, TypeOfHoursByYearDecimal } from "./typeOfHours";

type Seconds = number | bigInt;

interface CalculationTASData
  extends Omit<Calculation, "id">,
    Omit<CalculationTASModel, "calculationId" | "id"> {}
interface CalculationTeacherData
  extends Omit<Calculation, "id">,
    Omit<CalculationTeacher, "calculationId" | "id"> {}

export type CalculationWithTAS = Prisma.CalculationGetPayload<{
  include: { calculationTAS: true };
}>;
export type CalculationWithTeacher = Prisma.CalculationGetPayload<{
  include: { calculationTeacher: true };
}>;

export interface CalculationParam {
  calculations: Calculation[];
  calculationsFromPersistence?: Calculation[];
  year?: number;
  official?: Official;
  hourlyBalances: HourlyBalance[];
}

export interface CalculationTAS extends Calculation, CalculationTASModel {}
export interface CalculationTeacher extends Calculation, CalculationTeacher {}

export interface CalculationParamTAS extends CalculationParam {
  calculations: CalculationTAS[];
}

export interface PrismaCalculationFinderOptions
  extends Partial<Prisma.CalculationFindUniqueArgs> {}

export type CalculationCalculated = {
  calculations: CalculationTAS[];
  totalBalance: bigint;
  workingHours: TypeOfHour;
  nonWorkingHours: TypeOfHour;
  simpleHours: {
    typeOfHour: TYPES_OF_HOURS;
    value: bigint;
  };
  totalDiscount: bigint;
  balances: TypeOfHoursByYear[];
  balancesSanitized: TypeOfHoursByYearDecimal[];
};
