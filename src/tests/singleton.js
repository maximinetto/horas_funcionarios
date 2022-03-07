import { mockDeep } from "jest-mock-extended";
import prisma from "../persistence/persistence.config";

jest.mock("../persistence/persistence.config", () => {
  return {
    __esModule: true,
    default: mockDeep(),
  };
});

export const prismaMock = prisma;
