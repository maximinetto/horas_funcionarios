import {
  CalculationTASData,
  CalculationTeacherData,
} from "@/@types/calculations";
import database from "@/persistence/persistence.config";
import { Prisma } from "@prisma/client";

export class CalculationRepository {
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
    return database.calculation.findMany({
      where,
      ...options,
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
