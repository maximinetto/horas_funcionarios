import Calculation from "@/entities/Calculation";
import CalculationTAS from "@/entities/CalculationTAS";
import CalculationCreator from "../CalculationCreator";

export default class CalculationTASCreator implements CalculationCreator {
  create(calculation: CalculationTAS, id: string): Calculation {
    return CalculationTAS.from({
      id,
      month: calculation.month,
      year: calculation.year,
      surplusBusiness: calculation.surplusBusiness,
      surplusNonWorking: calculation.surplusNonWorking,
      surplusSimple: calculation.surplusSimple,
      discount: calculation.discount,
      compensatedNightOvertime: calculation.compensatedNightOvertime,
      workingNightOvertime: calculation.workingNightOvertime,
      nonWorkingNightOvertime: calculation.nonWorkingNightOvertime,
      nonWorkingOvertime: calculation.nonWorkingOvertime,
      workingOvertime: calculation.workingOvertime,
      observations: calculation.observations,
      actualBalance: calculation.actualBalance.get(),
      calculationId: calculation.calculationId,
    });
  }
}
