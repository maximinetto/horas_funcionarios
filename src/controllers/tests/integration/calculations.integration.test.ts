import { Month } from "@prisma/client";
import buildApp from "buildApp";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import MikroORMActualBalanceBuilder from "creators/actual/MikroORMActualBalanceBuilder";
import MikroORMOfficialBuilder from "creators/official/MikroORMOfficialBuilder";
import Official, { Contract, TypeOfOfficial } from "entities/Official";
import { FastifyInstance } from "fastify";
import _omit from "lodash/omit";
import { DateTime } from "luxon";
import OfficialService from "services/officials";
import { unitOfWork } from "setupIntegrationTestEnvironment";
import { secondsToTime } from "utils/time";

let fastify: FastifyInstance;
let officialService;

beforeAll(async () => {
  fastify = buildApp({
    logger: {
      level: process.env.LOG_LEVEL || "silent",
    },
    pluginTimeout: 2 * 60 * 1000,
  });
  officialService = new OfficialService({
    officialConverter: new OfficialConverter({
      officialBuilder: new MikroORMOfficialBuilder({
        actualHourlyBalanceBuilder: new MikroORMActualBalanceBuilder(),
      }),
    }),
    officialRepository: unitOfWork.official,
  });
});

describe("Calculations", () => {
  test("should be create a list of hours", async () => {
    await officialService.create(
      new Official({
        id: 1,
        recordNumber: 1184,
        firstName: "Maximiliano",
        lastName: "Minetto",
        position: "Informática",
        contract: Contract.PERMANENT,
        type: TypeOfOfficial.TAS,
        dateOfEntry: DateTime.fromObject({
          year: 2018,
          month: 6,
          day: 25,
        }),
        chargeNumber: 128,
      })
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

    const { actualHourlyBalances, currentYear } = serverReponse.json().data;

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
    const {
      totalBalance,
      totalDiscount,
      totalWorkingHours,
      totalNonWorkingHours,
      totalSimpleHours,
    } = currentYear;

    const actualCalculations = calculationsResponse.map((c) => {
      const ct = convert(c.calculationTAS);
      const others = _omit(c, ["actualBalanceId", "id"]);
      return {
        ...others,
        calculationTAS: ct,
      };
    });

    expect(serverReponse.statusCode).toEqual(201);
    expect(actualCalculations).toEqual(expected);
    expect(totalBalance).toEqual("4800");
    expect(totalDiscount).toEqual("1500");
    expect(totalSimpleHours.value).toEqual("3600");
    expect(totalWorkingHours.value).toEqual("2700");
    expect(totalNonWorkingHours.value).toEqual("0");

    const totalBalanceInTime = secondsToTime(4800n);
    expect(totalBalanceInTime).toEqual("01:20");

    const totalDiscountInTime = secondsToTime(1500n);
    expect(totalDiscountInTime).toEqual("00:25");

    const totalSimpleHoursInTime = secondsToTime(3600n);
    expect(totalSimpleHoursInTime).toEqual("01:00");

    const totalWorkingHoursInTime = secondsToTime(2700n);
    expect(totalWorkingHoursInTime).toEqual("00:45");

    const totalNonWorkingHoursInTime = secondsToTime(0n);
    expect(totalNonWorkingHoursInTime).toEqual("00:00");
  });

  test("should be throw a error because there are not officials", async () => {
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
