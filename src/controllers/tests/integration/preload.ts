import Decimal from "decimal.js";
import { DateTime } from "luxon";

import ActualHourlyBalanceBuilder from "../../../creators/actual/ActualHourlyBalanceBuilder";
import CalculationBuilder from "../../../creators/calculation/CalculationBuilder";
import { CalculationTASModel } from "../../../creators/calculation/types";
import HourlyBalanceTAS from "../../../entities/HourlyBalanceTAS";
import Official from "../../../entities/Official";
import { Month } from "../../../enums/common";
import { Contract, TypeOfOfficial } from "../../../enums/officials";
import Database from "../../../persistence/context/Database";
import OfficialService from "../../../services/officials";
import { generateRandomUUIDV4 } from "../../../utils/strings";
import { timeToSeconds } from "../../../utils/time";

const type = TypeOfOfficial.TAS;

type Params = {
  official: Official;
  calculationBuilder: CalculationBuilder;
  actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  unitOfWork: Database;
};

export const generateFirstCase = (params: {
  officialService: OfficialService;
  calculationBuilder: CalculationBuilder;
  actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  unitOfWork: Database;
}) => generate(params, first);

export const generateSecondCase = (params: {
  officialService: OfficialService;
  calculationBuilder: CalculationBuilder;
  actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  unitOfWork: Database;
}) => generate(params, second);

async function generate<T>(
  {
    calculationBuilder,
    officialService,
    actualHourlyBalanceBuilder,
    unitOfWork,
  }: {
    officialService: OfficialService;
    calculationBuilder: CalculationBuilder;
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
    unitOfWork: Database;
  },
  balances: (params: Params) => Promise<T>
) {
  const optionalOfficial = await createOfficial(officialService, unitOfWork);
  if (optionalOfficial.isEmpty()) throw new Error("Official not found");

  const official = optionalOfficial.get();

  const results = await balances({
    official,
    actualHourlyBalanceBuilder,
    calculationBuilder,
    unitOfWork,
  });

  await unitOfWork.commit();

  return {
    official,
    ...results,
  };
}

async function first({
  calculationBuilder,
  official,
  actualHourlyBalanceBuilder,
  unitOfWork,
}: Params) {
  const [lastActualBalance, currentBalance] = await Promise.all([
    createLastActualBalance(
      {
        calculationBuilder,
        official,
        actualHourlyBalanceBuilder,
        unitOfWork,
      },
      [
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          year: 2021,
          simple: new Decimal(23700),
          working: new Decimal(72900),
          nonWorking: new Decimal(14400),
        }),
      ],
      new Decimal(111000)
    ),
    createCurrentActualBalance(
      {
        calculationBuilder,
        official,
        actualHourlyBalanceBuilder,
        unitOfWork,
      },
      [
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          working: new Decimal(72900),
          nonWorking: new Decimal(14400),
          simple: new Decimal(180),
          year: 2021,
        }),
        new HourlyBalanceTAS({
          id: generateRandomUUIDV4(),
          year: 2022,
          simple: new Decimal(6600),
          working: new Decimal(1800),
          nonWorking: new Decimal(0),
        }),
      ],
      new Decimal(95880)
    ),
  ]);
  return {
    lastActualBalance,
    currentBalance,
  };
}

async function second({
  calculationBuilder,
  official,
  actualHourlyBalanceBuilder,
  unitOfWork,
}: Params) {
  const [previousActualBalance, lastActualBalance, currentBalance] =
    await Promise.all([
      createPreviousBalance({
        calculationBuilder,
        official,
        actualHourlyBalanceBuilder,
        unitOfWork,
      }),
      createLastActualBalance(
        {
          calculationBuilder,
          official,
          actualHourlyBalanceBuilder,
          unitOfWork,
        },
        [
          new HourlyBalanceTAS({
            id: generateRandomUUIDV4(),
            year: 2021,
            simple: new Decimal(32250),
            working: new Decimal(72900),
            nonWorking: new Decimal(14400),
          }),
        ],
        new Decimal(119550)
      ),
      createCurrentActualBalance(
        {
          calculationBuilder,
          official,
          actualHourlyBalanceBuilder,
          unitOfWork,
        },
        [
          new HourlyBalanceTAS({
            id: generateRandomUUIDV4(),
            simple: new Decimal(8730),
            working: new Decimal(72900),
            nonWorking: new Decimal(14400),
            year: 2021,
          }),
          new HourlyBalanceTAS({
            id: generateRandomUUIDV4(),
            simple: new Decimal(6600),
            working: new Decimal(1800),
            nonWorking: new Decimal(0),
            year: 2022,
          }),
        ],
        new Decimal(95880)
      ),
    ]);

  return {
    previousActualBalance,
    lastActualBalance,
    currentBalance,
  };
}

async function createCurrentActualBalance(
  {
    calculationBuilder,
    official,
    actualHourlyBalanceBuilder,
    unitOfWork,
  }: {
    calculationBuilder: CalculationBuilder;
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
    official: Official;
    unitOfWork: Database;
  },
  hourlyBalances: HourlyBalanceTAS[],
  total: Decimal
) {
  const year = 2022;
  const actualBalance = actualHourlyBalanceBuilder.create({
    id: generateRandomUUIDV4(),
    total: new Decimal(total),
    type: TypeOfOfficial.TAS,
    year,
    official,
  });

  const collectionOfCalculationModel: CalculationTASModel[] = [
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("01:20").toString()),
      discount: new Decimal(timeToSeconds("03:27").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.JANUARY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:20").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("01:05").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.FEBRUARY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.MARCH,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:30").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.APRIL,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("02:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.MAY,
      id: generateRandomUUIDV4(),
      type,
    },
  ];

  const calculations = collectionOfCalculationModel.map((calculation) =>
    calculationBuilder.createTAS(calculation)
  );

  actualBalance.setCalculations(calculations);
  actualBalance.setHourlyBalances(hourlyBalances);

  await unitOfWork.actualBalance.add(actualBalance);

  return actualBalance;
}

async function createLastActualBalance(
  {
    calculationBuilder,
    official,
    actualHourlyBalanceBuilder,
    unitOfWork,
  }: {
    calculationBuilder: CalculationBuilder;
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
    official: Official;
    unitOfWork: Database;
  },
  hourlyBalances: HourlyBalanceTAS[],
  total: Decimal
) {
  const year = 2021;

  const actualBalance = actualHourlyBalanceBuilder.create({
    id: generateRandomUUIDV4(),
    total: new Decimal(total),
    type: TypeOfOfficial.TAS,
    year,
    official,
  });

  const collectionOfCalculationModel: CalculationTASModel[] = [
    {
      surplusBusiness: new Decimal(timeToSeconds("00:30").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:10").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.JANUARY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("01:00").toString()),
      discount: new Decimal(timeToSeconds("00:15").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.FEBRUARY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("02:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.MARCH,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("01:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("01:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.APRIL,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.MAY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("05:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.JUNE,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("01:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.JULY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("12:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.AUGUST,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("02:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.SEPTEMBER,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.OCTOBER,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("03:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.NOVEMBER,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.DECEMBER,
      id: generateRandomUUIDV4(),
      type,
    },
  ];

  const calculations = collectionOfCalculationModel.map((calculation) =>
    calculationBuilder.createTAS(calculation)
  );

  actualBalance.setCalculations(calculations);
  actualBalance.setHourlyBalances(hourlyBalances);

  await unitOfWork.actualBalance.add(actualBalance);

  return actualBalance;
}

async function createPreviousBalance({
  calculationBuilder,
  official,
  actualHourlyBalanceBuilder,
  unitOfWork,
}: {
  calculationBuilder: CalculationBuilder;
  actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  official: Official;
  unitOfWork: Database;
}) {
  const year = 2020;
  const actualBalance = actualHourlyBalanceBuilder.create({
    id: generateRandomUUIDV4(),
    total: new Decimal(8550),
    type: TypeOfOfficial.TAS,
    year,
    official,
  });

  const collectionOfCalculationModel: CalculationTASModel[] = [
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.JANUARY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.FEBRUARY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("02:30").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.MARCH,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:24").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.APRIL,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:36").toString()),
      discount: new Decimal(timeToSeconds("00:06").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.MAY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.JUNE,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:45").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:30").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.JULY,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:21").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.AUGUST,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.SEPTEMBER,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.OCTOBER,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:00").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.NOVEMBER,
      id: generateRandomUUIDV4(),
      type,
    },
    {
      surplusBusiness: new Decimal(timeToSeconds("00:00").toString()),
      surplusNonWorking: new Decimal(timeToSeconds("00:00").toString()),
      surplusSimple: new Decimal(timeToSeconds("00:00").toString()),
      discount: new Decimal(timeToSeconds("00:30").toString()),
      workingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      workingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingOvertime: new Decimal(timeToSeconds("00:00").toString()),
      nonWorkingNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      compensatedNightOvertime: new Decimal(timeToSeconds("00:00").toString()),
      year,
      month: Month.DECEMBER,
      id: generateRandomUUIDV4(),
      type,
    },
  ];

  const hourlyBalance = new HourlyBalanceTAS({
    year,
    simple: new Decimal(4500),
    working: new Decimal(4050),
    nonWorking: new Decimal(14400),
    id: generateRandomUUIDV4(),
  });

  const calculations = collectionOfCalculationModel.map((calculation) =>
    calculationBuilder.createTAS(calculation)
  );

  actualBalance.setCalculations(calculations);
  actualBalance.setHourlyBalances([hourlyBalance]);

  await unitOfWork.actualBalance.add(actualBalance);

  return actualBalance;
}

async function createOfficial(
  officialService: OfficialService,
  unitOfWork: Database
) {
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

  const officials = await officialService.get();
  const official = officials.at(0);
  if (!official) throw new Error("official must be defined");

  return unitOfWork.official.get(official.id);
}
