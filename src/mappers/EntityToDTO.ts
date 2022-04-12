import { CalculationTAS } from "@/@types/calculations";
import {
  Calculation,
  CalculationTAS as CalculationTASModel,
} from "@prisma/client";

export function calculationTas(
  calculation: Calculation,
  calculationTAS: CalculationTASModel
): CalculationTAS {
  return {
    actualBalanceId: calculation.actualBalanceId,
    calculationId: calculation.id,
    observations: calculation.observations,
    month: calculation.month,
    year: calculation.year,
    id: calculationTAS.id,
    discount: calculationTAS.discount,
    compensatedNightOvertime: calculationTAS.compensatedNightOvertime,
    nonWorkingNightOvertime: calculationTAS.compensatedNightOvertime,
    nonWorkingOvertime: calculationTAS.nonWorkingOvertime,
    workingOvertime: calculationTAS.workingOvertime,
    surplusBusiness: calculationTAS.surplusBusiness,
    surplusNonWorking: calculationTAS.surplusNonWorking,
    surplusSimple: calculationTAS.surplusSimple,
    workingNightOvertime: calculationTAS.workingNightOvertime,
  };
}

export function calculationTasFromArray(
  calculations: Calculation[]
): CalculationTAS[] {
  return calculations.map((calculation) => {
    if (isCalculationTAS(calculation)) {
      return <CalculationTAS>calculation;
    } else if ("calculationTAS" in calculation) {
      return calculationTas(calculation, calculation["calculationTAS"]);
    }
    throw new Error("calculation is not a CalculationTAS");
  });
}

function isCalculationTAS(
  calculation: Calculation
): calculation is CalculationTAS {
  return "calculationId" in calculation;
}
