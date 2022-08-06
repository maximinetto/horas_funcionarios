import { asClass, createContainer } from "awilix";
import CalculationTASConverterDTO from "converters/dtos_to_entities/CalculationTASConverter";
import ActualBalanceConverter from "converters/models_to_entities/ActualBalanceConverter";
import BalanceConverter from "converters/models_to_entities/BalanceConverter";
import CalculationConverter from "converters/models_to_entities/CalculationConverter";
import CalculationTASConverter from "converters/models_to_entities/CalculationTASConverter";
import CalculationTeacherConverter from "converters/models_to_entities/CalculationTeacherConverter";
import HourlyBalanceConverter from "converters/models_to_entities/HourlyBalanceConverter";
import HourlyBalanceTASConverter from "converters/models_to_entities/HourlyBalanceTASConverter";
import HourlyBalanceTeacherConverter from "converters/models_to_entities/HourlyBalanceTeacher";
import OfficialConverter from "converters/models_to_entities/OfficialConverter";
import HourlyBalanceEntityFactoryCreator from "factories/HourlyBalanceEntityFactoryCreator";
import HourlyBalanceModelFactoryCreator from "factories/HourlyBalanceModelFactoryCreator";
import PrismaActualHourlyBalanceRepository from "persistence/ActualBalance/PrismaActualHourlyBalanceRepository";
import PrismaCalculationRepository from "persistence/Calculation/PrismaCalculationRepository";
import OfficialRepository from "persistence/Official/PrismaOfficialRepository";
import Calculator from "services/calculations";
import CalculationValidator from "services/calculations/classes/CalculationValidator";
import CalculatorRowService from "services/calculations/classes/TAS/CalculatorRowService";
import HoursTASCalculator from "services/calculations/classes/TAS/HoursTASCalculator";
import RecalculatorService from "services/calculations/classes/TAS/RecalculatorService";
import BalancesPerYearCalculator from "services/calculations/classes/TAS/YearsCalculator";
import TASCalculator from "services/calculations/TAS";
import Balances from "services/hourlyBalances";
import ActualHourlyBalanceCreator from "services/hourlyBalances/ActualHourlyBalanceCreator";
import ActualHourlyBalanceReplacer from "services/hourlyBalances/ActualHourlyBalanceReplacer";
import OfficialService from "services/officials";
import CalculationSorter from "sorters/CalculationSorter";

const container = createContainer();

container.register({
  actualHourlyBalanceRepository: asClass(
    PrismaActualHourlyBalanceRepository
  ).singleton(),
  actualHourlyBalanceCreator: asClass(ActualHourlyBalanceCreator).singleton(),
  actualHourlyBalanceReplacer: asClass(ActualHourlyBalanceReplacer).singleton(),
  balanceConverter: asClass(BalanceConverter).singleton(),
  balances: asClass(Balances).singleton(),
  balancesPerYearCalculator: asClass(BalancesPerYearCalculator).singleton(),
  calculationConverter: asClass(CalculationConverter).singleton(),
  calculationRepository: asClass(PrismaCalculationRepository).singleton(),
  calculationSorter: asClass(CalculationSorter).singleton(),
  calculationTASConverter: asClass(CalculationTASConverter).singleton(),
  calculationTASConverterDTO: asClass(CalculationTASConverterDTO).singleton(),
  calculationTeacherConverter: asClass(CalculationTeacherConverter).singleton(),
  calculationValidator: asClass(CalculationValidator).singleton(),
  calculator: asClass(Calculator).singleton(),
  calculatorRowService: asClass(CalculatorRowService).singleton(),
  hoursTASCalculator: asClass(HoursTASCalculator).singleton(),
  officialRepository: asClass(OfficialRepository).singleton(),
  officialService: asClass(OfficialService).singleton(),
  recalculatorService: asClass(RecalculatorService).singleton(),
  tasCalculator: asClass(TASCalculator).singleton(),
  actualBalanceConverter: asClass(ActualBalanceConverter).singleton(),
  officialConverter: asClass(OfficialConverter).singleton(),
  hourlyBalanceConverter: asClass(HourlyBalanceConverter).singleton(),
  hourlyBalanceEntityFactoryCreator: asClass(
    HourlyBalanceEntityFactoryCreator
  ).singleton(),
  hourlyBalanceModelFactoryCreator: asClass(
    HourlyBalanceModelFactoryCreator
  ).singleton(),
  hourlyBalanceTASConverter: asClass(HourlyBalanceTASConverter).singleton(),
  hourlyBalanceTeacherConverter: asClass(
    HourlyBalanceTeacherConverter
  ).singleton(),
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
export const calculationConverter = container.resolve(
  "calculationConverter"
) as CalculationConverter;
export const officialConverter = container.resolve(
  "officialConverter"
) as OfficialConverter;
