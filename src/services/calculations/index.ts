import { TypeOfOfficials } from "@prisma/client";
import Calculations from "collections/Calculations";
import { logger } from "config";
import CalculationTASConverter from "converters/CalculationTASConverter";
import CalculationTASDTO from "dto/create/calculationTASDTO";
import NotExistsError from "errors/NotExistsError";
import { IOfficialRepository } from "persistence/officials";
import TASCalculator from "services/calculations/TAS";

// TODO si el año ya está calculado y existen posteriores lo mejor es mandarlo a una cola
export default class Calculator {
  private officialRepository: IOfficialRepository;
  private tasCalculator: TASCalculator;
  private calculationTASConverter: CalculationTASConverter;

  constructor({
    officialRepository,
    tasCalculator,
    calculationTASConverter,
  }: {
    officialRepository: IOfficialRepository;
    tasCalculator: TASCalculator;
    calculationTASConverter: CalculationTASConverter;
  }) {
    this.officialRepository = officialRepository;
    this.tasCalculator = tasCalculator;
    this.calculationTASConverter = calculationTASConverter;
  }

  async execute({
    calculations,
    year,
    officialId,
  }: {
    calculations: CalculationTASDTO[];
    year: number;
    officialId: number;
  }) {
    officialId = Number(officialId);
    const officialInstance = await this.officialRepository.getOne(officialId);
    if (officialInstance.isEmpty()) {
      throw new NotExistsError("The official does not exists");
    }

    const official = officialInstance.get();

    if (official.type === TypeOfOfficials.TEACHER) {
      this.calculateForTeacher({
        officialId,
        year,
      });
    }

    const calculationEntities =
      this.calculationTASConverter.fromDTOsToEntities(calculations);

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
