import Calculation from "entities/Calculation";
import { TypeOfOfficial } from "enums/officials";
import UnexpectedValueError from "errors/UnexpectedValueError";
import MikroORMRepository from "persistence/MikroORMRepository";

import CalculationRepository from "./CalculationRepository";
import CalculationTASRepository from "./CalculationTAS/CalculationTASRepository";
import CalculationTeacherRepository from "./CalculationTeacher/CalculationTeacherRepository";

export default class MikroORMCalculationRepository
  extends MikroORMRepository<string, Calculation>
  implements CalculationRepository
{
  private _calculationTASRepository: CalculationTASRepository;
  private _calculationTeacherRepository: CalculationTeacherRepository;

  constructor({
    calculationTASRepository,
    calculationTeacherRepository,
  }: {
    calculationTASRepository: CalculationTASRepository;
    calculationTeacherRepository: CalculationTeacherRepository;
  }) {
    super({ modelName: "Calculation" });
    this._calculationTASRepository = calculationTASRepository;
    this._calculationTeacherRepository = calculationTeacherRepository;
  }

  getCalculationWithYearGreaterThanActual({
    officialId,
    year,
    type,
  }: {
    officialId: number;
    year: number;
    type: TypeOfOfficial;
  }) {
    if (type === TypeOfOfficial.TAS) {
      return this._calculationTASRepository.getCalculationsTASWithYearGreaterThanActual(
        {
          officialId,
          year,
        }
      );
    }
    if (type === TypeOfOfficial.TEACHER) {
      return this._calculationTeacherRepository.getCalculationsTeacherWithYearGreaterThanActual(
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
    type: TypeOfOfficial;
  }): Promise<Calculation[]> {
    if (type === TypeOfOfficial.TAS) {
      return this._calculationTASRepository.getCalculationsTASWithActualYear({
        officialId,
        year,
      });
    }

    if (type === TypeOfOfficial.TEACHER) {
      return this._calculationTeacherRepository.getCalculationsTeacherWithActualYear(
        {
          officialId,
          year,
        }
      );
    }

    throw new UnexpectedValueError("Type of official invalid");
  }
}
