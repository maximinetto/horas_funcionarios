import { PrismaClient } from "@prisma/client";
import _omit from "lodash/omit";

import CalculationConverter from "../../converters/models_to_entities/CalculationConverter";
import Calculation from "../../entities/Calculation";
import CalculationTAS from "../../entities/CalculationTAS";
import { TypeOfOfficial } from "../../enums/officials";
import { NotNullableCalculationWithTAS } from "../../types/calculations";
import PrismaRepository from "../PrismaRepository";
import CalculationRepository from "./CalculationRepository";

export const includeCalculationsTAS = () => ({
  include: {
    calculationTAS: true,
  },
});

export default class PrismaCalculationRepository
  extends PrismaRepository<string, Calculation>
  implements CalculationRepository
{
  private calculationConverter: CalculationConverter;

  constructor({
    calculationConverter,
    prisma,
  }: {
    calculationConverter: CalculationConverter;
    prisma: PrismaClient;
  }) {
    super({ prisma, modelName: "calculation" });
    this.calculationConverter = calculationConverter;
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
    throw new Error("Method not implemented.");
  }
  getCalculationWithYearGreaterThanActual({
    officialId,
    year,
    type,
  }: {
    officialId: number;
    year: number;
    type: TypeOfOfficial;
  }): Promise<Calculation[]> {
    throw new Error("Method not implemented.");
  }

  toEntity(value: any): Calculation {
    return this.calculationConverter.fromModelToEntity(value);
  }

  toModel(value: Calculation) {
    return this.calculationConverter.fromEntityToModel(value);
  }

  updateTAS(entity: CalculationTAS) {
    const { id, year, month, observations, actualBalanceId, calculationTAS } =
      this.calculationConverter.fromEntityToModel(
        entity
      ) as NotNullableCalculationWithTAS;

    const restOfProps = _omit(calculationTAS, ["calculationId", "id"]);
    return this._prisma.calculationTAS.update({
      where: {
        id,
      },
      data: {
        calculation: {
          update: {
            observations,
            year,
            month,
            actualBalanceId,
          },
        },
        ...restOfProps,
      },
    });
  }
}
