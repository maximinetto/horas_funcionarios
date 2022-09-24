import Decimal from "decimal.js";

import ActualBalance from "../../creators/actual/types";
import type Entity from "../../entities/Entity";
import { Month } from "../../enums/common";
import { TypeOfOfficial } from "../../enums/officials";

export interface CalculationModel extends Entity {
  id: string;
  year: number;
  month: Month;
  observations?: string;
  insert?: boolean;
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
  actualBalance?: ActualBalance;
}

export interface CalculationTeacherModel extends CalculationModel {
  surplus: Decimal;
  actualBalance: ActualBalance;
}
