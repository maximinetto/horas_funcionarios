import { CalculationTAS } from "@/@types/calculations";
import CalculationTASConverter from "@/converters/CalculationTASConverter";
import Entity from "@/entities/CalculationTAS";

export const converter = (calculations: CalculationTAS[]): Entity[] => {
  const converter = new CalculationTASConverter();
  return converter.fromModelsToEntities(calculations);
};
