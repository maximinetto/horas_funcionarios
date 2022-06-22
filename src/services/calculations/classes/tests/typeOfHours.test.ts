import Hours from "@/services/calculations/classes/typeOfHours";
import { prismaMock } from "@/singleton";

const service = new Hours();

test("Get Previous hour", () => {
  expect(service.getPreviousTypeOfHour(Hours.nonWorking)).toBe(Hours.working);
  expect(service.getPreviousTypeOfHour(Hours.simple)).toBe(Hours.nonWorking);
  expect(service.getPreviousTypeOfHour(Hours.working)).toBe(Hours.simple);
});

afterEach(() => {
  prismaMock.$disconnect();
  jest.clearAllMocks();
});
