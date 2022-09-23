import CalculationTAS from "../../../entities/CalculationTAS";
import MikroORMRepository from "../../MikroORMRepository";
import CalculationTASRepository from "./CalculationTASRepository";

export default class MikroORMCalculationTASRepository
  extends MikroORMRepository<string, CalculationTAS>
  implements CalculationTASRepository
{
  constructor() {
    super({ modelName: "CalculationTAS" });
  }

  getCalculationsTASWithYearGreaterThanActual({
    officialId,
    year,
  }: {
    year: number;
    officialId: number;
  }) {
    return this._mikroorm.em.find(CalculationTAS, {
      year: {
        $gte: year,
      },
      actualBalance: {
        official: {
          id: officialId,
        },
      },
    });
  }

  getCalculationsTASWithActualYear({
    officialId,
    year,
  }: {
    officialId: number;
    year: number;
  }): Promise<CalculationTAS[]> {
    return this._mikroorm.em.find(CalculationTAS, {
      actualBalance: {
        official: {
          id: officialId,
        },
      },
      year,
    });
  }
}
