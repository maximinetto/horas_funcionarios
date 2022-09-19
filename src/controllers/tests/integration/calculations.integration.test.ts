import buildApp from "buildApp";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import MikroORMActualBalanceBuilder from "creators/actual/MikroORMActualBalanceBuilder";
import CalculationBuilder from "creators/calculation/CalculationBuilder";
import MikroORMCalculationBuilder from "creators/calculation/MikroORMCalculationBuilder";
import MikroORMOfficialBuilder from "creators/official/MikroORMOfficialBuilder";
import OfficialBuilder from "creators/official/OfficialBuilder";
import type CalculationTASDTOWithTimeFieldsInString from "dto/create/CalculationTASDTOWithTimeFieldsInString";
import CalculationTAS from "entities/CalculationTAS";
import Official from "entities/Official";
import { Month } from "enums/common";
import { Contract, TypeOfOfficial } from "enums/officials";
import { FastifyInstance } from "fastify";
import _omit from "lodash/omit";
import { DateTime } from "luxon";
import OfficialService from "services/officials";
import { unitOfWork } from "setupIntegrationTestEnvironment";
import { getMonthByNumber } from "utils/mapMonths";
import { secondsToTime } from "utils/time";

import generate from "./preload";

let fastify: FastifyInstance;
let officialService: OfficialService;
let actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
let calculationBuilder: CalculationBuilder;
let officialBuilder: OfficialBuilder;

beforeAll(() => {
  fastify = buildApp({
    logger: {
      level: process.env.LOG_LEVEL || "silent",
    },
    pluginTimeout: 2 * 60 * 1000,
  });
  actualHourlyBalanceBuilder = new MikroORMActualBalanceBuilder();
  officialBuilder = new MikroORMOfficialBuilder({
    actualHourlyBalanceBuilder,
  });
  calculationBuilder = new MikroORMCalculationBuilder({
    actualHourlyBalanceBuilder,
  });
  officialService = new OfficialService({
    officialConverter: new OfficialConverter({
      officialBuilder,
    }),
    officialRepository: unitOfWork.official,
  });
});

afterAll(() => {
  return fastify.close();
});

describe("Calculations", () => {
  test("should be create a list of hours", async () => {
    await officialService.create(
      new Official({
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

    const [{ id }] = await officialService.get();

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
      url: `/api/v1/calculations/year/2021/officials/${id}`,
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

    debugger;
    const serverReponse = await fastify.inject({
      url: "/api/v1/calculations/year/2021/officials/1",
      method: "POST",
      payload: data,
    });

    expect(serverReponse.json()).toEqual({
      message: "The official does not exists",
    });
  });
  test("should be calculate correctly from a list of previous hours", async () => {
    const { currentBalance, official } = await generate({
      officialService,
      calculationBuilder,
      actualHourlyBalanceBuilder,
      unitOfWork,
    });

    const [first, second] = currentBalance
      .getCalculations()
      .filter((c) => c.month === Month.JANUARY || c.month === Month.FEBRUARY);

    const calculation1: CalculationTASDTOWithTimeFieldsInString = {
      year: 2022,
      month: 1,
      observations: "Sabelo flaco",
      id: first.id,
      surplusSimple: "01:45",
      surplusBusiness: "00:00",
      surplusNonWorking: "00:00",
      compensatedNightOvertime: "00:00",
      discount: "03:27",
      nonWorkingNightOvertime: "00:00",
      nonWorkingOvertime: "00:00",
      workingNightOvertime: "00:00",
      workingOvertime: "00:00",
      actualBalanceId: currentBalance.id,
    };

    const calculation2 = {
      year: 2022,
      month: 2,
      observations: "Sabelo flacazo",
      id: second.id,
      surplusSimple: "00:30",
      surplusBusiness: "00:00",
      surplusNonWorking: "00:00",
      compensatedNightOvertime: "00:00",
      discount: "01:05",
      nonWorkingNightOvertime: "00:00",
      nonWorkingOvertime: "00:00",
      workingNightOvertime: "00:00",
      workingOvertime: "00:00",
      actualBalanceId: currentBalance.id,
    };

    const data = {
      calculations: [calculation1, calculation2],
    };

    const serverReponse = await fastify.inject({
      url: `/api/v1/calculations/year/2022/officials/${official.id}`,
      method: "POST",
      payload: data,
    });

    const { actualHourlyBalances, currentYear } = serverReponse.json().data;

    // console.log("{ actualHourlyBalances, currentYear }", {
    //   actualHourlyBalances,
    //   currentYear,
    // });

    const expected = convert2(
      [
        { ...calculation1, id: first.id },
        { ...calculation2, id: second.id },
      ],
      [...(currentBalance.getCalculations().slice(2) as CalculationTAS[])]
    );

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
        calculationTAS: {
          ...ct,
          id: c.calculationTAS.id,
          actualBalanceId: c.calculationTAS.actualBalanceId,
        },
      };
    });

    const totalBalanceExpected = "97380";
    const totalDiscountExpected = "23520";
    const totalSimpleHoursExpected = "9900";
    const totalWorkingHoursExpected = "0";
    const totalNonWorkingHoursExpected = "0";

    expect(serverReponse.statusCode).toEqual(201);
    expect(actualCalculations).toEqual(expected);
    expect(totalBalance).toEqual(totalBalanceExpected);
    expect(totalDiscount).toEqual(totalDiscountExpected);
    expect(totalSimpleHours.value).toEqual(totalSimpleHoursExpected);
    expect(totalWorkingHours.value).toEqual(totalWorkingHoursExpected);
    expect(totalNonWorkingHours.value).toEqual(totalNonWorkingHoursExpected);

    const totalBalanceInTime = secondsToTime(BigInt(totalBalanceExpected));
    expect(totalBalanceInTime).toEqual("27:03");

    const totalDiscountInTime = secondsToTime(BigInt(totalDiscountExpected));
    expect(totalDiscountInTime).toEqual("06:32"); // hice hasta acá

    const totalSimpleHoursInTime = secondsToTime(
      BigInt(totalSimpleHoursExpected)
    );
    expect(totalSimpleHoursInTime).toEqual("02:45");

    const totalWorkingHoursInTime = secondsToTime(
      BigInt(totalWorkingHoursExpected)
    );
    expect(totalWorkingHoursInTime).toEqual("00:00");

    const totalNonWorkingHoursInTime = secondsToTime(
      BigInt(totalNonWorkingHoursExpected)
    );
    expect(totalNonWorkingHoursInTime).toEqual("00:00");
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

function convert2(
  data: CalculationTASDTOWithTimeFieldsInString[],
  calculations: CalculationTAS[]
) {
  const firstCollection = data.map((c) => ({
    year: c.year,
    month: getMonthByNumber(c.month),
    observations: c.observations,
    calculationTAS: {
      ..._omit(c, ["year", "month", "observations"]),
      actualBalanceId: undefined,
    },
  }));

  const lastCollection = calculations.map((c) => ({
    year: c.year,
    month: c.month,
    observations: c.observations,
    calculationTAS: {
      surplusSimple: secondsToTime(BigInt(c.surplusSimple.toString())),
      surplusBusiness: secondsToTime(BigInt(c.surplusBusiness.toString())),
      surplusNonWorking: secondsToTime(BigInt(c.surplusNonWorking.toString())),
      workingNightOvertime: secondsToTime(
        BigInt(c.workingNightOvertime.toString())
      ),
      compensatedNightOvertime: secondsToTime(
        BigInt(c.compensatedNightOvertime.toString())
      ),
      nonWorkingNightOvertime: secondsToTime(
        BigInt(c.nonWorkingNightOvertime.toString())
      ),
      workingOvertime: secondsToTime(BigInt(c.workingOvertime.toString())),
      nonWorkingOvertime: secondsToTime(
        BigInt(c.nonWorkingOvertime.toString())
      ),
      discount: secondsToTime(BigInt(c.discount.toString())),
      id: c.id,
      actualBalanceId: undefined,
    },
    //     year: calculation1.year,
    //     month: getMonthByNumber(calculation1.month),
    //     observations: calculation1.observations,
    //     calculationTAS: {
    //       ..._omit(calculation1, ["year", "month", "observations"]),
    //     },
  }));

  return [...firstCollection, ...lastCollection];
}
