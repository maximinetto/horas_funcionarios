import ActualHourlyBalanceBuilder from "../../creators/actual/ActualHourlyBalanceBuilder";
import ActualBalanceTAS from "../../entities/ActualBalanceTAS";
import ActualBalanceTeacher from "../../entities/ActualBalanceTeacher";
import Calculation from "../../entities/Calculation";
import CalculationTAS from "../../entities/CalculationTAS";
import CalculationTeacher from "../../entities/CalculationTeacher";
import { TypeOfOfficial } from "../../enums/officials";
import UnexpectedValueError from "../../errors/UnexpectedValueError";
import { mikroorm } from "../../persistence/context/mikroorm/MikroORMDatabase";
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
    if (calculation.type === TypeOfOfficial.TAS) {
      return this.createTAS(calculation as CalculationTASModel);
    } else if (calculation.type === TypeOfOfficial.TEACHER) {
      return this.createTeacher(calculation as CalculationTeacherModel);
    }

    throw new UnexpectedValueError("Type of Official not found");
  }

  public createTAS({
    insert = true,
    ...calculationTAS
  }: CalculationTASModel): CalculationTAS {
    let actualBalance: ActualBalanceTAS | undefined;
    if (calculationTAS.actualBalance)
      actualBalance = this._actualHourlyBalanceBuilder.create(
        calculationTAS.actualBalance
      ) as ActualBalanceTAS;

    const data = {
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
    };

    if (!insert)
      return mikroorm.em.merge(CalculationTAS, data, {
        refresh: true,
      });
    return new CalculationTAS(data);
  }

  public createTeacher({
    insert = true,
    ...calculationTeacher
  }: CalculationTeacherModel): CalculationTeacher {
    let actualBalance: ActualBalanceTeacher | undefined;
    if (calculationTeacher.actualBalance)
      actualBalance = this._actualHourlyBalanceBuilder.create(
        calculationTeacher.actualBalance
      ) as ActualBalanceTeacher;

    const data = {
      id: calculationTeacher.id,
      year: calculationTeacher.year,
      month: calculationTeacher.month,
      observations: calculationTeacher.observations,
      discount: calculationTeacher.discount,
      surplus: calculationTeacher.surplus,
      actualBalance,
      createdAt: calculationTeacher.createdAt,
      updatedAt: calculationTeacher.updatedAt,
    };

    if (!insert)
      return mikroorm.em.merge<CalculationTeacher>(CalculationTeacher, data);

    return new CalculationTeacher(data);
  }
}
