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
import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import MikroORMActualBalanceBuilder from "creators/actual/MikroORMActualBalanceBuilder";
import MikroORMOfficialBuilder from "creators/official/MikroORMOfficialBuilder";
import HourlyBalanceEntityFactoryCreator from "factories/HourlyBalanceEntityFactoryCreator";
import HourlyBalanceModelFactoryCreator from "factories/HourlyBalanceModelFactoryCreator";
import MikroORMActualHourlyBalanceRepository from "persistence/ActualBalance/MikroORMActualHourlyBalanceRepository";
import MikroORMCalculationTASRepository from "persistence/Calculation/CalculationTAS/MikroORMCalculationTASRepository";
import MikroORMCalculationTeacherRepository from "persistence/Calculation/CalculationTeacher/MikroORMCalculationTeacherRepository";
import MikroORMCalculationRepository from "persistence/Calculation/MikroORMCalculationRepository";
import OfficialRepository from "persistence/Official/MikroORMOfficialRepository";
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
import ActualHourlyBalanceSaver from "services/hourlyBalances/ActualHourlyBalanceSaver";
import OfficialService from "services/officials";
import CalculationSorter from "sorters/CalculationSorter";

const container = createContainer();

container.register({
  actualHourlyBalanceRepository: asClass(
    MikroORMActualHourlyBalanceRepository
  ).singleton(),
  actualHourlyBalanceCreator: asClass(ActualHourlyBalanceCreator).singleton(),
  actualHourlyBalanceBuilder: asClass(MikroORMActualBalanceBuilder).singleton(),
  actualHourlyBalanceReplacer: asClass(ActualHourlyBalanceReplacer).singleton(),
  balanceConverter: asClass(BalanceConverter).singleton(),
  balances: asClass(Balances).singleton(),
  balancesPerYearCalculator: asClass(BalancesPerYearCalculator).singleton(),
  calculationConverter: asClass(CalculationConverter).singleton(),
  calculationRepository: asClass(MikroORMCalculationRepository).singleton(),
  calculationSorter: asClass(CalculationSorter).singleton(),
  calculationTASRepository: asClass(
    MikroORMCalculationTASRepository
  ).singleton(),
  calculationTeacherRepository: asClass(
    MikroORMCalculationTeacherRepository
  ).singleton(),
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
  officialBuilder: asClass(MikroORMOfficialBuilder),
  actualHourlyBalanceSaver: asClass(ActualHourlyBalanceSaver).singleton(),
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
export const actualHourlyBalanceBuilder = container.resolve(
  "actualHourlyBalanceBuilder"
) as ActualHourlyBalanceBuilder;
