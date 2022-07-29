import { TypeOfOfficials } from "@prisma/client";
import Calculations from "collections/Calculations";
import { logger } from "config";
import CalculationTASConverter from "converters/dtos_to_entities/CalculationTASConverter";
import ActualBalanceConverter from "converters/models_to_entities/ActualBalanceConverter";
import CalculationConverter from "converters/models_to_entities/CalculationConverter";
import CalculationTASDTOWithTimeFieldsInString from "dto/create/calculationTASDTOWithTimeFieldsInString";
import ActualBalance from "entities/ActualBalance";
import NotExistsError from "errors/NotExistsError";
import { IOfficialRepository } from "persistence/officials";
import { sanitizeCalculationFields } from "sanitizers/calculations";
import TASCalculator from "services/calculations/TAS";
import { CalculationCalculated } from "types/calculations";

// TODO si el año ya está calculado y existen posteriores lo mejor es mandarlo a una cola
export default class Calculator {
  private officialRepository: IOfficialRepository;
  private tasCalculator: TASCalculator;
  private calculationTASConverterDTO: CalculationTASConverter;
  private actualBalanceConverter: ActualBalanceConverter;
  private calculationConverter: CalculationConverter;

  constructor({
    officialRepository,
    tasCalculator,
    calculationTASConverterDTO,
    actualBalanceConverter,
    calculationConverter,
  }: {
    officialRepository: IOfficialRepository;
    tasCalculator: TASCalculator;
    calculationTASConverterDTO: CalculationTASConverter;
    actualBalanceConverter: ActualBalanceConverter;
    calculationConverter: CalculationConverter;
  }) {
    this.officialRepository = officialRepository;
    this.tasCalculator = tasCalculator;
    this.calculationTASConverterDTO = calculationTASConverterDTO;
    this.actualBalanceConverter = actualBalanceConverter;
    this.calculationConverter = calculationConverter;
  }

  async execute({
    calculations,
    year,
    officialId,
  }: {
    calculations: CalculationTASDTOWithTimeFieldsInString[];
    year: number;
    officialId: number;
  }) {
    officialId = Number(officialId);
    const officialInstance = await this.officialRepository.getOne(officialId);
    if (officialInstance.isEmpty()) {
      throw new NotExistsError("The official does not exists");
    }

    const official = officialInstance.get();
    const calculationsSanitazed = sanitizeCalculationFields(calculations);

    if (official.type === TypeOfOfficials.TEACHER) {
      this.calculateForTeacher({
        officialId,
        year,
      });
    }

    const calculationEntities =
      this.calculationTASConverterDTO.fromDTOsToEntities(calculationsSanitazed);
    const calculationCollection = new Calculations(...calculationEntities);

    const result = await this.tasCalculator.calculate({
      official,
      calculations: calculationCollection,
      year,
    });

    return this.toModel(result);
  }

  calculateForTeacher({ officialId, year }) {
    logger.info("Calculate for teacher", {
      officialId,
      year,
    });
  }

  private toModel(data: {
    currentYear: CalculationCalculated;
    others: CalculationCalculated[];
    actualHourlyBalances: ActualBalance[];
  }) {
    const actualHourlyBalances =
      this.actualBalanceConverter.fromEntitiesToModels(
        data.actualHourlyBalances
      );
    const calculations = this.calculationConverter.fromEntitiesToModels(
      data.currentYear.calculations
    );
    const currentYear = {
      ...data.currentYear,
      calculations,
    };
    const others = data.others;

    return {
      actualHourlyBalances,
      currentYear,
      others,
    };
  }
}
