import { asClass, asValue, createContainer } from "awilix";

import BalanceConverter from "@/converters/BalanceConverter";
import { ActualHourlyBalanceRepository } from "@/persistence/actualBalance";
import { CalculationRepository } from "@/persistence/calculations";
import OfficialRepository from "@/persistence/officials";
import prisma from "@/persistence/persistence.config";
import Calculator from "@/services/calculations";
import CalculationValidator from "@/services/calculations/classes/CalculationValidator";
import CalculatorRowService from "@/services/calculations/classes/TAS/CalculatorRowService";
import HoursTASCalculator from "@/services/calculations/classes/TAS/HoursTASCalculator";
import RecalculatorService from "@/services/calculations/classes/TAS/RecalculatorService";
import BalancesPerYearCalculator from "@/services/calculations/classes/TAS/YearsCalculator";
import TASCalculator from "@/services/calculations/TAS";
import Balances from "@/services/hourlyBalances";
import ActualHourlyBalanceCreator from "@/services/hourlyBalances/ActualHourlyBalanceCreator";
import ActualHourlyBalanceReplacer from "@/services/hourlyBalances/ActualHourlyBalanceReplacer";
import OfficialService from "@/services/officials";
import CalculationSorter from "@/sorters/CalculationSorter";

const container = createContainer();

container.register({
  officialRepository: asClass(OfficialRepository).singleton(),
  officialService: asClass(OfficialService).singleton(),
  database: asValue(prisma),
  calculator: asClass(Calculator).singleton(),
  calculatorRowService: asClass(CalculatorRowService).singleton(),
  calculationRepository: asClass(CalculationRepository).singleton(),
  recalculatorService: asClass(RecalculatorService).singleton(),
  actualHourlyBalanceRepository: asClass(
    ActualHourlyBalanceRepository
  ).singleton(),
  balanceConverter: asClass(BalanceConverter).singleton(),
  actualHourlyBalanceCreator: asClass(ActualHourlyBalanceCreator).singleton(),
  actualHourlyBalanceReplacer: asClass(ActualHourlyBalanceReplacer).singleton(),
  hoursTASCalculator: asClass(HoursTASCalculator).singleton(),
  calculationValidator: asClass(CalculationValidator).singleton(),
  balancesPerYearCalculator: asClass(BalancesPerYearCalculator).singleton(),
  balances: asClass(Balances).singleton(),
  calculationSorter: asClass(CalculationSorter).singleton(),
  tasCalculator: asClass(TASCalculator).singleton(),
});

export const officialService = container.resolve(
  "officialService"
) as OfficialService;
export const calculator = container.resolve("calculator") as Calculator;
export const balances = container.resolve("balances") as Balances;
export const calculatorRowService = container.resolve(
  "calculatorRowService"
) as CalculatorRowService;
export const tasCalculator = container.resolve(
  "tasCalculator"
) as TASCalculator;
