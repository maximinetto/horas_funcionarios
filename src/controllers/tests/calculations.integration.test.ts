import { Contract, TypeOfOfficials } from "@prisma/client";
import { officialService } from "dependencies/container";
import Official from "entities/Official";
import { DateTime } from "luxon";
import prisma from "persistence/persistence.config";
import setupTestEnvironment from "setupTestEnvironment";

const fastify = setupTestEnvironment();

describe("Calculations", () => {
  afterEach(async () => {
    const deleteCalculations = prisma.calculation.deleteMany();
    const deleteHourlyBalances = prisma.hourlyBalance.deleteMany();
    const deleteHourlyBalancesTAS = prisma.hourlyBalanceTAS.deleteMany();
    const deleteHourlyBalancesTeacher =
      prisma.hourlyBalanceTeacher.deleteMany();
    const deleteOfficials = prisma.official.deleteMany();
    const deleteActualBalances = prisma.actualBalance.deleteMany();

    console.log("after");
    await prisma.$transaction([
      deleteCalculations,
      deleteHourlyBalancesTeacher,
      deleteHourlyBalancesTAS,
      deleteHourlyBalances,
      deleteOfficials,
      deleteActualBalances,
    ]);

    await prisma.$disconnect();
  });

  test("should be create a list of hours", async () => {
    await officialService.create(
      new Official(
        1,
        1184,
        "Maximiliano",
        "Minetto",
        "Informática",
        Contract.TEMPORARY,
        TypeOfOfficials.NOT_TEACHER,
        DateTime.fromObject({
          day: 25,
          month: 6,
          year: 2018,
        }),
        129
      )
    );

    const data = {
      calculations: [
        {
          year: 2021,
          month: 1,
          observations: "Sabelo flaco",
          surplusBusiness: "00:30",
          surplusNonWorking: "00:00",
          surplusSimple: "00:00",
          discount: "00:10",
          workingOvertime: "00:00",
          workingNightOvertime: "00:00",
          nonWorkingOvertime: "00:00",
          nonWorkingNightOvertime: "00:00",
          compensatedNightOvertime: "00:00",
        },
        {
          year: 2021,
          month: 2,
          observations: "Sabelo flacazo",
          surplusBusiness: "00:00",
          surplusNonWorking: "00:00",
          surplusSimple: "01:00",
          discount: "00:15",
          workingOvertime: "00:00",
          workingNightOvertime: "00:00",
          nonWorkingOvertime: "00:00",
          nonWorkingNightOvertime: "00:00",
          compensatedNightOvertime: "00:00",
        },
      ],
    };

    const serverReponse = await fastify.inject({
      url: "/api/v1/calculations/year/2021/officials/1",
      method: "POST",
      payload: data,
    });

    expect(serverReponse.body).toEqual({});
  });

  test("should be throw a error because there are not offcials", async () => {
    const data = {
      calculations: [
        {
          year: 2021,
          month: 1,
          observations: "Sabelo flaco",
          surplusBusiness: "00:30",
          surplusNonWorking: "00:00",
          surplusSimple: "00:00",
          discount: "00:10",
          workingOvertime: "00:00",
          workingNightOvertime: "00:00",
          nonWorkingOvertime: "00:00",
          nonWorkingNightOvertime: "00:00",
          compensatedNightOvertime: "00:00",
        },
        {
          year: 2021,
          month: 2,
          observations: "Sabelo flacazo",
          surplusBusiness: "00:00",
          surplusNonWorking: "00:00",
          surplusSimple: "01:00",
          discount: "00:15",
          workingOvertime: "00:00",
          workingNightOvertime: "00:00",
          nonWorkingOvertime: "00:00",
          nonWorkingNightOvertime: "00:00",
          compensatedNightOvertime: "00:00",
        },
      ],
    };

    // Should create official

    const serverReponse = await fastify.inject({
      url: "/api/v1/calculations/year/2021/officials/1",
      method: "POST",
      payload: data,
    });

    expect(serverReponse.json()).toEqual({
      message: "The official does not exists",
    });
  });
});
