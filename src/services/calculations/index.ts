import { FilterQuery, FindOptions } from "@mikro-orm/core";

import Calculations from "../../collections/Calculations";
import { logger } from "../../config";
import CalculationTASConverter from "../../converters/dtos_to_entities/CalculationTASConverter";
import ActualBalanceConverter from "../../converters/models_to_entities/ActualBalanceConverter";
import CalculationConverter from "../../converters/models_to_entities/CalculationConverter";
import CalculationTASDTO from "../../dto/create/CalculationTASDTO";
import CalculationTASDTOWithTimeFieldsInString from "../../dto/create/CalculationTASDTOWithTimeFieldsInString";
import ActualBalance from "../../entities/ActualBalance";
import CalculationTAS from "../../entities/CalculationTAS";
import { TypeOfOfficial } from "../../enums/officials";
import NotExistsError from "../../errors/NotExistsError";
import UnexpectedError from "../../errors/UnexpectedError";
import CalculationTASRepository from "../../persistence/Calculation/CalculationTAS/CalculationTASRepository";
import OfficialRepository from "../../persistence/Official/OfficialRepository";
import { sanitizeCalculationFields } from "../../sanitizers/calculations";
import TASCalculator from "../../services/calculations/TAS";
import { CalculationCalculated } from "../../types/calculations";

// TODO si el año ya está calculado y existen posteriores lo mejor es mandarlo a una cola
export default class Calculator {
  private officialRepository: OfficialRepository;
  private tasCalculator: TASCalculator;
  private calculationTASConverterDTO: CalculationTASConverter;
  private actualBalanceConverter: ActualBalanceConverter;
  private calculationConverter: CalculationConverter;
  private calculationTASRepository: CalculationTASRepository;

  constructor({
    officialRepository,
    tasCalculator,
    calculationTASConverterDTO,
    actualBalanceConverter,
    calculationConverter,
    calculationTASRepository,
  }: {
    officialRepository: OfficialRepository;
    calculationTASRepository: CalculationTASRepository;
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
    this.calculationTASRepository = calculationTASRepository;
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
    const officialInstance = await this.officialRepository.get(officialId);
    if (officialInstance.isEmpty()) {
      throw new NotExistsError("The official does not exists");
    }

    const official = officialInstance.get();
    const calculationsSanitazed = sanitizeCalculationFields(calculations);

    if (official.type === TypeOfOfficial.TEACHER) {
      this.calculateForTeacher({
        officialId,
        year,
      });
    }

    const calculationCollection = await this.setCalculations(
      calculationsSanitazed
    );

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

  private;

  private async setCalculations(calculations: CalculationTASDTO[]) {
    const calculationToUpdate = calculations.filter((c) => !c.insert);

    const ids = calculationToUpdate.map((c) => c.id);
    const filter: FilterQuery<CalculationTAS> = {
      id: {
        $in: ids,
      },
    };
    const options: FindOptions<CalculationTAS, "actualBalance"> = {
      populate: ["actualBalance"],
    };

    const calculationsFound = await this.calculationTASRepository.filter(
      filter,
      options
    );

    if (calculationsFound.length > 0) {
      calculationsFound.forEach((calculationFound) => {
        const calculationToUpdate = calculations.find(
          (c) => c.id === calculationFound.id
        );
        if (!calculationToUpdate)
          throw new UnexpectedError("calculationToUpdate must be found");

        const model = calculationToUpdate.toModel();

        model.actualBalance = calculationFound.actualBalance;

        calculationFound.replace(model);
      });
    }

    const calculationEntities =
      this.calculationTASConverterDTO.fromDTOsToEntities(
        calculations.filter((c) => c.insert)
      );
    return new Calculations(...calculationEntities, ...calculationsFound);
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
