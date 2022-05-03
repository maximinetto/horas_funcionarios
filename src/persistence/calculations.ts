import {
  CalculationTASData,
  CalculationTeacherData,
} from "@/@types/calculations";
import CalculationConverter from "@/converters/CalculationConverter";
import database from "@/persistence/persistence.config";
import { Prisma } from "@prisma/client";

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

  get(
    where: Prisma.CalculationWhereInput,
    options?: Omit<Prisma.CalculationFindManyArgs, "where">
  ) {
    return database.calculation
      .findMany({
        where,
        ...options,
      })
      .then((c) => {
        return c.map((c: any) => {
          const aux = { ...c };
          c.calculationTAS ? (aux.calculationTAS = c.calculationTAS) : null;
          c.calculationTeacher
            ? (aux.calculationTeacher = c.calculationTeacher)
            : null;

          return this.calculationConverter.fromModelToEntity(aux);
        });
      });
  }

  createTAS({
    year,
    month,
    observations,
    actualBalanceId,
    compensatedNightOvertime,
    nonWorkingNightOvertime,
    nonWorkingOvertime,
    surplusBusiness,
    surplusNonWorking,
    surplusSimple,
    workingNightOvertime,
    workingOvertime,
    discount,
  }: CalculationTASData) {
    return database.calculationTAS.create({
      data: {
        calculation: {
          create: {
            observations,
            year,
            month,
            actualBalanceId,
          },
        },
        compensatedNightOvertime,
        nonWorkingNightOvertime,
        nonWorkingOvertime,
        surplusBusiness,
        surplusNonWorking,
        surplusSimple,
        workingNightOvertime,
        workingOvertime,
        discount,
      },
    });
  }

  createTeacher({
    year,
    month,
    observations,
    actualBalanceId,
    discount,
    surplus,
  }: CalculationTeacherData) {
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

  updateTAS(
    id: string,
    {
      year,
      month,
      observations,
      actualBalanceId,
      discount,
      compensatedNightOvertime,
      nonWorkingNightOvertime,
      nonWorkingOvertime,
      surplusBusiness,
      surplusNonWorking,
      surplusSimple,
      workingNightOvertime,
      workingOvertime,
    }: CalculationTASData
  ) {
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
        compensatedNightOvertime,
        nonWorkingNightOvertime,
        nonWorkingOvertime,
        surplusBusiness,
        surplusNonWorking,
        surplusSimple,
        workingNightOvertime,
        workingOvertime,
        discount,
      },
    });
  }

  updateTeacher(
    id: string,
    {
      year,
      month,
      observations,
      actualBalanceId,
      discount,
      surplus,
    }: CalculationTeacherData
  ) {
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
