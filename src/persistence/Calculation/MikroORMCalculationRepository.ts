import { TypeOfOfficials } from "@prisma/client";
import Calculation from "entities/Calculation";
import UnexpectedValueError from "errors/UnexpectedValueError";
import MikroORMRepository from "persistence/MikroORMRepository";

import CalculationRepository from "./CalculationRepository";
import CalculationTASRepository from "./CalculationTAS/CalculationTASRepository";

export default class MikroORMCalculationRepository
  extends MikroORMRepository<string, Calculation>
  implements CalculationRepository
{
  private _calculationTASRepository: CalculationTASRepository;

  constructor({
    calculationTASRepository,
  }: {
    calculationTASRepository: CalculationTASRepository;
  }) {
    super({ modelName: "Calculation" });
    this._calculationTASRepository = calculationTASRepository;
  }

  getCalculationWithYearGreaterThanActual({
    officialId,
    year,
    type,
  }: {
    officialId: number;
    year: number;
    type: TypeOfOfficials;
  }) {
    if (type === TypeOfOfficials.TEACHER) {
      return this._calculationTASRepository.getCalculationsTASWithYearGreaterThanActual(
        {
          officialId,
          year,
        }
      );
    }

    throw new UnexpectedValueError("Type of official not found");
  }

  getCalculationsWithActualYear({
    officialId,
    year,
    type,
  }: {
    officialId: number;
    year: number;
    type: TypeOfOfficials;
  }): Promise<Calculation[]> {
    if (type === TypeOfOfficials.TEACHER) {
      return this._calculationTASRepository.getCalculationsTASWithActualYear({
        officialId,
        year,
      });
    }

    throw new UnexpectedValueError("Type of official invalid");
  }
}
