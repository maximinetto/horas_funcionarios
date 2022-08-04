import { PrismaClient } from "@prisma/client";
import CalculationTASConverter from "converters/models_to_entities/CalculationTASConverter";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTASRepository from "persistence/Calculation/CalculationTAS/CalculationTASRepository";
import PrismaRepository from "persistence/PrismaRepository";

export default class PrismaCalculationTASRepository
  extends PrismaRepository<string, CalculationTAS>
  implements CalculationTASRepository
{
  private calculationTASConverter: CalculationTASConverter;

  constructor({
    prisma,
    calculationTASConverter,
  }: {
    prisma: PrismaClient;
    calculationTASConverter: CalculationTASConverter;
  }) {
    super({ prisma, modelName: "calculationTAS" });
    this.calculationTASConverter = calculationTASConverter;
  }

  toEntity(value: any): CalculationTAS {
    return this.calculationTASConverter.fromModelToEntity(value);
  }

  toModel(value: CalculationTAS): object {
    return this.calculationTASConverter.fromEntityToModel(value);
  }
}
