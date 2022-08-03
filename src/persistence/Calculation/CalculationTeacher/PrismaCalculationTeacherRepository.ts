import { PrismaClient } from "@prisma/client";
import CalculationTeacherConverter from "converters/models_to_entities/CalculationTeacherConverter";
import CalculationTeacher from "entities/CalculationTeacher";
import CalculationTeacherRepository from "persistence/Calculation/CalculationTeacher/CalculationTeacherRepository";
import PrismaRepository from "persistence/PrismaRepository";

export default class PrismaCalculationTeacherRepository
  extends PrismaRepository<string, CalculationTeacher>
  implements CalculationTeacherRepository
{
  private calculationTeacherConverter: CalculationTeacherConverter;

  constructor({
    database,
    calculationTeacherConverter,
  }: {
    database: PrismaClient;
    calculationTeacherConverter: CalculationTeacherConverter;
  }) {
    super({ database, modelName: "calculationTAS" });
    this.calculationTeacherConverter = calculationTeacherConverter;
  }

  toEntity(value: any): CalculationTeacher {
    return this.calculationTeacherConverter.fromModelToEntity(value);
  }

  toModel(value: CalculationTeacher): object {
    return this.calculationTeacherConverter.fromEntityToModel(value);
  }
}
