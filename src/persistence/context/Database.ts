import ActualHourlyBalanceRepository from "persistence/ActualBalance/ActualHourlyBalanceRepository";
import CalculationRepository from "persistence/Calculation/CalculationRepository";
import CalculationTASRepository from "persistence/Calculation/CalculationTAS/CalculationTASRepository";
import CalculationTeacherRepository from "persistence/Calculation/CalculationTeacher/CalculationTeacherRepository";
import HourlyBalanceRepository from "persistence/HourlyBalance/HourlyBalanceRepository";
import OfficialRepository from "persistence/Official/OfficialRepository";

export default interface Database {
  init(): Promise<void>;
  close(): Promise<void>;
  commit(): Promise<void>;
  calculation: CalculationRepository;
  calculationTAS: CalculationTASRepository;
  calculationTeacher: CalculationTeacherRepository;
  actualBalance: ActualHourlyBalanceRepository;
  hourlyBalance: HourlyBalanceRepository;
  official: OfficialRepository;
}
