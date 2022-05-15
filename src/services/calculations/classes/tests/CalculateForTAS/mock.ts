import { ActualBalanceRepository } from "@/persistence/actualBalance";

jest.mock("@/persistence/calculations");

// export const calculationRepository: jest.Mock<> =

export const actualBalanceRepository: jest.Mocked<ActualBalanceRepository> = {
  getBalanceTASBYOfficialIdAndYear: jest.fn(),
  getTAS: jest.fn(),
};
