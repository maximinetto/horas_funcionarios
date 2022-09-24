import CalculationTASDTO from "../dto/create/CalculationTASDTO";
import CalculationTASDTOWithTimeFieldsInString from "../dto/create/CalculationTASDTOWithTimeFieldsInString";
import { getMonthByNumber } from "../utils/mapMonths";
import { timeToSeconds } from "../utils/time";

export const sanitizeCalculationFields = (
  calculations: CalculationTASDTOWithTimeFieldsInString[]
): CalculationTASDTO[] => {
  return calculations.map((calculation) => {
    const surplusBusiness = timeToSeconds(calculation.surplusBusiness);
    const surplusNonWorking = timeToSeconds(calculation.surplusNonWorking);
    const surplusSimple = timeToSeconds(calculation.surplusSimple);
    const workingOvertime = timeToSeconds(calculation.workingOvertime);
    const workingNightOvertime = timeToSeconds(
      calculation.workingNightOvertime
    );
    const nonWorkingOvertime = timeToSeconds(calculation.nonWorkingOvertime);
    const nonWorkingNightOvertime = timeToSeconds(
      calculation.nonWorkingNightOvertime
    );
    const compensatedNightOvertime = timeToSeconds(
      calculation.compensatedNightOvertime
    );
    const discount = timeToSeconds(calculation.discount);

    const month = getMonthByNumber(calculation.month);

    return new CalculationTASDTO({
      id: calculation.id,
      year: calculation.year,
      month,
      observations: calculation.observations,
      actualBalanceId: calculation.actualBalanceId,
      surplusBusiness,
      surplusNonWorking,
      surplusSimple,
      discount,
      workingOvertime,
      workingNightOvertime,
      nonWorkingOvertime,
      nonWorkingNightOvertime,
      compensatedNightOvertime,
      insert: calculation.id == null,
    });
  });
};
