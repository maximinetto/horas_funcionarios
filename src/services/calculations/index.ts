import { TypeOfOfficials } from "@prisma/client";
import Calculations from "collections/Calculations";
import CalculationTAS from "entities/CalculationTAS";
import NotExistsError from "errors/NotExistsError";
import { IOfficialRepository } from "persistence/officials";
import TASCalculator from "services/calculations/TAS";

// TODO si el año ya está calculado y existen posteriores lo mejor es mandarlo a una cola
export default class Calculator {
  private officialRepository: IOfficialRepository;
  private tasCalculator: TASCalculator;

  constructor({
    officialRepository,
    tasCalculator,
  }: {
    officialRepository: IOfficialRepository;
    tasCalculator: TASCalculator;
  }) {
    this.officialRepository = officialRepository;
    this.tasCalculator = tasCalculator;
  }

  async execute({
    calculations,
    year,
    officialId,
  }: {
    calculations: Calculations<CalculationTAS>;
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

    return this.tasCalculator.calculate({ official, calculations, year });
  }

  calculateForTeacher({ officialId, year }) {
    console.log({
      officialId,
      year,
    });
  }
}
