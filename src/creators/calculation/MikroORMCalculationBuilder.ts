import ActualHourlyBalanceBuilder from "creators/actual/ActualHourlyBalanceBuilder";
import ActualBalanceTAS from "entities/ActualBalanceTAS";
import Calculation from "entities/Calculation";
import CalculationTAS from "entities/CalculationTAS";
import CalculationTeacher from "entities/CalculationTeacher";
import UnexpectedValueError from "errors/UnexpectedValueError";
import { mikroorm } from "persistence/context/mikroorm/MikroORMDatabase";

import CalculationBuilder from "./CalculationBuilder";
import {
  CalculationModel,
  CalculationTASModel,
  CalculationTeacherModel,
} from "./types";

export default class MikroORMCalculationBuilder implements CalculationBuilder {
  private _actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;

  constructor({
    actualHourlyBalanceBuilder,
  }: {
    actualHourlyBalanceBuilder: ActualHourlyBalanceBuilder;
  }) {
    this._actualHourlyBalanceBuilder = actualHourlyBalanceBuilder;
  }

  create(calculation: CalculationModel): Calculation {
    if (calculation.type === "tas") {
      return this.createTAS(calculation as CalculationTASModel);
    } else if (calculation.type === "teacher") {
      return this.createTeacher(calculation as CalculationTeacherModel);
    }

    throw new UnexpectedValueError("Type of Official not found");
  }

  public createTAS(calculationTAS: CalculationTASModel): CalculationTAS {
    console.log("calculationId:", calculationTAS.id);
    const actualBalance = this._actualHourlyBalanceBuilder.create(
      calculationTAS.actualBalance
    ) as ActualBalanceTAS;
    return new CalculationTAS({
      id: calculationTAS.id,
      year: calculationTAS.year,
      month: calculationTAS.month,
      observations: calculationTAS.observations,
      discount: calculationTAS.discount,
      compensatedNightOvertime: calculationTAS.compensatedNightOvertime,
      nonWorkingNightOvertime: calculationTAS.nonWorkingNightOvertime,
      nonWorkingOvertime: calculationTAS.nonWorkingOvertime,
      workingNightOvertime: calculationTAS.workingNightOvertime,
      surplusBusiness: calculationTAS.surplusBusiness,
      surplusSimple: calculationTAS.surplusSimple,
      workingOvertime: calculationTAS.workingOvertime,
      surplusNonWorking: calculationTAS.surplusNonWorking,
      actualBalance,
      createdAt: calculationTAS.createdAt,
      updatedAt: calculationTAS.updatedAt,
    });
  }

  public createTeacher(
    calculationTeacher: CalculationTeacherModel
  ): CalculationTeacher {
    return mikroorm.em.create(CalculationTeacher, {
      id: calculationTeacher.id,
      year: calculationTeacher.year,
      month: calculationTeacher.month,
      observations: calculationTeacher.observations,
      discount: calculationTeacher.discount,
      surplus: calculationTeacher.surplus,
      actualBalance: calculationTeacher.actualBalance,
      createdAt: calculationTeacher.createdAt,
      updatedAt: calculationTeacher.updatedAt,
    });
  }
}
