import { Prisma } from "@prisma/client";
import _omit from "lodash/omit";

import Calculations from "collections/Calculations";
import CalculationConverter from "converters/CalculationConverter";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTeacher from "entities/CalculationTeacher";
import database from "persistence/persistence.config";
import {
  CalculationWithTAS,
  NotNullableCalculationWithTAS,
  NotNullableCalculationWithTeacher,
} from "types/calculations";

export const includeCalculationsTAS = () => ({
  include: {
    calculationTAS: true,
  },
});

export class CalculationRepository {
  private calculationConverter: CalculationConverter;
  constructor(calculationConverter?: CalculationConverter) {
    this.calculationConverter =
      calculationConverter || new CalculationConverter();

    this.get.bind(this);
  }

  getOne(
    where: Prisma.CalculationWhereInput,
    options: Omit<Prisma.CalculationFindUniqueArgs, "where">
  ) {
    return database.calculation.findFirst({
      where,
      ...options,
    });
  }

  async get(
    where: Prisma.CalculationWhereInput,
    options?: Omit<Prisma.CalculationFindManyArgs, "where">
  ): Promise<Calculations<Calculation>> {
    const calculations = (await database.calculation.findMany({
      where,
      ...options,
    })) as CalculationWithTAS[];

    const calculationsArray =
      this.calculationConverter.fromModelsToEntities(calculations);

    return new Calculations(...calculationsArray);
  }

  createTAS(entity: CalculationTAS) {
    const { year, month, observations, actualBalanceId, calculationTAS } =
      this.calculationConverter.fromEntityToModel(
        entity
      ) as NotNullableCalculationWithTAS;

    const restOfProps = _omit(calculationTAS, ["calculationId", "id"]);

    return database.calculationTAS.create({
      data: {
        calculation: {
          create: {
            observations,
            month,
            year,
            actualBalanceId,
          },
        },
        ...restOfProps,
      },
    });
  }

  createTeacher(entity: CalculationTeacher) {
    const { calculationTeacher, month, actualBalanceId, observations, year } =
      this.calculationConverter.fromEntityToModel(
        entity
      ) as NotNullableCalculationWithTeacher;

    const { discount, surplus } = calculationTeacher;

    return database.calculationTeacher.create({
      data: {
        calculation: {
          create: {
            observations,
            year,
            month,
            actualBalanceId,
          },
        },
        discount,
        surplus,
      },
    });
  }

  updateTAS(entity: CalculationTAS) {
    const { id, year, month, observations, actualBalanceId, calculationTAS } =
      this.calculationConverter.fromEntityToModel(
        entity
      ) as NotNullableCalculationWithTAS;

    const restOfProps = _omit(calculationTAS, ["calculationId", "id"]);
    return database.calculationTAS.update({
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

  updateTeacher(entity: CalculationTeacher) {
    const {
      id,
      calculationTeacher,
      month,
      actualBalanceId,
      observations,
      year,
    } = this.calculationConverter.fromEntityToModel(
      entity
    ) as NotNullableCalculationWithTeacher;

    const { discount, surplus } = calculationTeacher;

    return database.calculationTeacher.update({
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
        discount,
        surplus,
      },
    });
  }

  delete(id: string) {
    return database.calculation.delete({
      where: {
        id,
      },
    });
  }
}
