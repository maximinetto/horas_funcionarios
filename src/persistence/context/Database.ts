import ActualHourlyBalanceRepository from "../ActualBalance/ActualHourlyBalanceRepository";
import CalculationRepository from "../Calculation/CalculationRepository";
import CalculationTASRepository from "../Calculation/CalculationTAS/CalculationTASRepository";
import CalculationTeacherRepository from "../Calculation/CalculationTeacher/CalculationTeacherRepository";
import HourlyBalanceRepository from "../HourlyBalance/HourlyBalanceRepository";
import HourlyBalanceTASRepository from "../HourlyBalance/HourlyBalanceTASRepository";
import HourlyBalanceTeacherRepository from "../HourlyBalance/HourlyBalanceTeacherRepository";
import OfficialRepository from "../Official/OfficialRepository";

export default interface Database {
  init(): Promise<void>;
  close(): Promise<void>;
  commit(): Promise<void>;
  clear(): Promise<void>;
  calculation: CalculationRepository;
  calculationTAS: CalculationTASRepository;
  calculationTeacher: CalculationTeacherRepository;
  actualBalance: ActualHourlyBalanceRepository;
  hourlyBalance: HourlyBalanceRepository;
  hourlyBalanceTAS: HourlyBalanceTASRepository;
  hourlyBalanceTeacher: HourlyBalanceTeacherRepository;
  official: OfficialRepository;
}
