import { Month } from "@prisma/client";
import ActualBalance from "creators/actual/types";
import Decimal from "decimal.js";
import type Entity from "entities/Entity";
import { TypeOfOfficial } from "entities/Official";

export interface CalculationModel extends Entity {
  id: string;
  year: number;
  month: Month;
  observations?: string;
  type: TypeOfOfficial;
  discount: Decimal;
}

export interface CalculationTASModel extends CalculationModel {
  compensatedNightOvertime: Decimal;
  nonWorkingNightOvertime: Decimal;
  nonWorkingOvertime: Decimal;
  workingNightOvertime: Decimal;
  surplusBusiness: Decimal;
  surplusSimple: Decimal;
  workingOvertime: Decimal;
  surplusNonWorking: Decimal;
  actualBalance: ActualBalance;
}

export interface CalculationTeacherModel extends CalculationModel {
  surplus: Decimal;
  actualBalance: ActualBalance;
}
