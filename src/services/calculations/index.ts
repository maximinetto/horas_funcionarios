import { TypeOfOfficials } from "@prisma/client";
import Calculations from "collections/Calculations";
import { logger } from "config";
import CalculationTASConverter from "converters/dtos_to_entities/CalculationTASConverter";
import CalculationTASDTOWitgTimeFieldsInString from "dto/create/calculationTASDTOWithTimeFieldsInString";
import NotExistsError from "errors/NotExistsError";
import { IOfficialRepository } from "persistence/officials";
import { sanitizeCalculationFields } from "sanitizers/calculations";
import TASCalculator from "services/calculations/TAS";

// TODO si el año ya está calculado y existen posteriores lo mejor es mandarlo a una cola
export default class Calculator {
  private officialRepository: IOfficialRepository;
  private tasCalculator: TASCalculator;
  private calculationTASConverterDTO: CalculationTASConverter;

  constructor({
    officialRepository,
    tasCalculator,
    calculationTASConverterDTO,
  }: {
    officialRepository: IOfficialRepository;
    tasCalculator: TASCalculator;
    calculationTASConverterDTO: CalculationTASConverter;
  }) {
    this.officialRepository = officialRepository;
    this.tasCalculator = tasCalculator;
    this.calculationTASConverterDTO = calculationTASConverterDTO;
  }

  async execute({
    calculations,
    year,
    officialId,
  }: {
    calculations: CalculationTASDTOWitgTimeFieldsInString[];
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

    console.log("Calculating TAS", { calculationsSanitazed });
    if (official.type === TypeOfOfficials.TEACHER) {
      this.calculateForTeacher({
        officialId,
        year,
      });
    }

    const calculationEntities =
      this.calculationTASConverterDTO.fromDTOsToEntities(calculationsSanitazed);
    const calculationCollection = new Calculations(...calculationEntities);

    return this.tasCalculator.calculate({
      official,
      calculations: calculationCollection,
      year,
    });
  }

  calculateForTeacher({ officialId, year }) {
    logger.info("Calculate for teacher", {
      officialId,
      year,
    });
  }
}
