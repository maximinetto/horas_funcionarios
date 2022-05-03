import { ActualBalanceRepository } from "@/persistence/actualBalance";
import { CalculationRepository } from "@/persistence/calculations";

export const calculationRepository: jest.Mocked<CalculationRepository> = {
  createTAS: jest.fn(),
  createTeacher: jest.fn(),
  updateTAS: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  getOne: jest.fn(),
  updateTeacher: jest.fn(),
};

export const actualBalanceRepository: jest.Mocked<ActualBalanceRepository> = {
  getBalanceTASBYOfficialIdAndYear: jest.fn(),
  getTAS: jest.fn(),
};
