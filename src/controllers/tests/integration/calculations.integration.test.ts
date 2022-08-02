import { Contract, Month, TypeOfOfficials } from "@prisma/client";
import { officialService } from "dependencies/container";
import Official from "entities/Official";
import _omit from "lodash/omit";
import { DateTime } from "luxon";
import prisma from "persistence/persistence.config";
import setupTestEnvironment from "setupTestEnvironment";
import { secondsToTime } from "utils/time";

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
        Contract.PERMANENT,
        TypeOfOfficials.NOT_TEACHER,
        DateTime.fromObject({
          year: 2018,
          month: 6,
          day: 25,
        }),
        128
      )
    );

    const calculationTAS1 = {
      surplusBusiness: "00:30",
      surplusNonWorking: "00:00",
      surplusSimple: "00:00",
      discount: "00:10",
      workingOvertime: "00:00",
      workingNightOvertime: "00:00",
      nonWorkingOvertime: "00:00",
      nonWorkingNightOvertime: "00:00",
      compensatedNightOvertime: "00:00",
    };

    const calculationTAS2 = {
      surplusBusiness: "00:00",
      surplusNonWorking: "00:00",
      surplusSimple: "01:00",
      discount: "00:15",
      workingOvertime: "00:00",
      workingNightOvertime: "00:00",
      nonWorkingOvertime: "00:00",
      nonWorkingNightOvertime: "00:00",
      compensatedNightOvertime: "00:00",
    };

    const calculation1 = {
      year: 2021,
      month: 1,
      observations: "Sabelo flaco",
      ...calculationTAS1,
    };

    const calculation2 = {
      year: 2021,
      month: 2,
      observations: "Sabelo flacazo",
      ...calculationTAS2,
    };

    const data = {
      calculations: [calculation1, calculation2],
    };

    const serverReponse = await fastify.inject({
      url: "/api/v1/calculations/year/2021/officials/1",
      method: "POST",
      payload: data,
    });

    const { actualHourlyBalances } = serverReponse.json().data;

    const expected = [
      {
        year: 2021,
        month: Month.JANUARY,
        observations: "Sabelo flaco",
        calculationTAS: { ...calculationTAS1 },
      },
      {
        year: 2021,
        month: Month.FEBRUARY,
        observations: "Sabelo flacazo",
        calculationTAS: {
          ...calculationTAS2,
        },
      },
    ];

    const calculationsResponse = actualHourlyBalances[0].calculations;

    const actualCalculations = calculationsResponse.map((c) => {
      const ct = convert(c.calculationTAS);
      console.log(ct);

      const others = _omit(c, "actualBalanceId");
      return {
        ...others,
        calculationTAS: ct,
      };
    });

    expect(serverReponse.statusCode).toEqual(201);
    expect(actualCalculations).toEqual(expected);
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

function convert(calculationTAS: any) {
  return {
    surplusBusiness: secondsToTime(BigInt(calculationTAS.surplusBusiness)),
    surplusNonWorking: secondsToTime(BigInt(calculationTAS.surplusNonWorking)),
    surplusSimple: secondsToTime(BigInt(calculationTAS.surplusSimple)),
    discount: secondsToTime(BigInt(calculationTAS.discount)),
    workingOvertime: secondsToTime(BigInt(calculationTAS.workingOvertime)),
    workingNightOvertime: secondsToTime(
      BigInt(calculationTAS.workingNightOvertime)
    ),
    nonWorkingOvertime: secondsToTime(
      BigInt(calculationTAS.nonWorkingOvertime)
    ),
    nonWorkingNightOvertime: secondsToTime(
      BigInt(calculationTAS.nonWorkingNightOvertime)
    ),
    compensatedNightOvertime: secondsToTime(
      BigInt(calculationTAS.compensatedNightOvertime)
    ),
  };
}
