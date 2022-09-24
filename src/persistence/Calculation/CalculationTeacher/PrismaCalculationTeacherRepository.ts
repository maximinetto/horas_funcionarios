import { PrismaClient } from "@prisma/client";

import CalculationTeacherConverter from "../../../converters/models_to_entities/CalculationTeacherConverter";
import CalculationTeacher from "../../../entities/CalculationTeacher";
import CalculationTeacherRepository from "../../Calculation/CalculationTeacher/CalculationTeacherRepository";
import PrismaRepository from "../../PrismaRepository";

export default class PrismaCalculationTeacherRepository
  extends PrismaRepository<string, CalculationTeacher>
  implements CalculationTeacherRepository
{
  private calculationTeacherConverter: CalculationTeacherConverter;

  constructor({
    prisma,
    calculationTeacherConverter,
  }: {
    prisma: PrismaClient;
    calculationTeacherConverter: CalculationTeacherConverter;
  }) {
    super({ prisma, modelName: "calculationTAS" });
    this.calculationTeacherConverter = calculationTeacherConverter;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCalculationsTeacherWithYearGreaterThanActual(arg0: {
    officialId: number;
    year: number;
  }): Promise<CalculationTeacher[]> {
    throw new Error("Method not implemented.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCalculationsTeacherWithActualYear(arg0: {
    officialId: number;
    year: number;
  }): Promise<CalculationTeacher[]> {
    throw new Error("Method not implemented.");
  }

  toEntity(value: any): CalculationTeacher {
    return this.calculationTeacherConverter.fromModelToEntity(value);
  }

  toModel(value: CalculationTeacher): object {
    return this.calculationTeacherConverter.fromEntityToModel(value);
  }
}
