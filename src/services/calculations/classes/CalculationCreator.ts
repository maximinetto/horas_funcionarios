import Calculation from "@/entities/Calculation";

export default interface CalculationCreator {
  create(calculation: Calculation, id: string): Calculation;
}
