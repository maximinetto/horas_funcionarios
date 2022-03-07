// import { faker } from "@faker-js/faker";
import { mockReset } from "jest-mock-extended";
import { prismaMock } from "./singleton";

describe("Officials controller tests", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  test("Should create a new official", async () => {
    const service = require("services/officials").default;
    const official = {
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    };

    prismaMock.official.create.mockResolvedValue(official);

    await expect(service.create(official)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    });
  });

  test("Should update an existing official record", async () => {
    const service = require("services/officials").default;
    const official = {
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    };

    prismaMock.official.update.mockResolvedValue(official);

    await expect(service.update(official.id, official)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    });
  });

  test("Should delete a official record", async () => {
    const service = require("services/officials").default;
    const official = {
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    };

    prismaMock.official.delete.mockResolvedValue(official);

    await expect(service.delete(official.id)).resolves.toEqual({
      id: 1,
      recordNumber: 3333,
      firstName: "Maximiliano",
      lastName: "Minetto",
      position: "Director",
      dateOfEntry: new Date("2020-01-01"),
      chargeNumber: 333333,
      type: "TEACHER",
      contract: "PERMANENT",
    });

    expect(prismaMock.official.delete).toHaveBeenCalledWith({
      where: { id: official.id },
    });

    expect(prismaMock.official.delete).toHaveBeenCalledTimes(1);
  });
});
