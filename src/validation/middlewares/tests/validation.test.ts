import { Request, Response } from "express";

import { schemas } from "@/validation/schemas/calculations";

import middleware from "../validation";

describe("Validate", () => {
  test("middleware is valid", async () => {
    const schema = schemas.create;

    const req = {
      body: {
        calculations: [
          {
            year: 2019,
            month: 3,
            observations: "",
            surplusBusiness: "00:00",
            surplusNonWorking: "00:00",
            surplusSimple: "00:10",
            discount: "00:00",
            workingOvertime: "00:00",
            workingNightOvertime: "00:00",
            nonWorkingOvertime: "00:00",
            nonWorkingNightOvertime: "00:00",
            compensatedNightOvertime: "00:00",
          },
          {
            year: 2019,
            month: 4,
            observations: "",
            surplusBusiness: "00:00",
            surplusNonWorking: "00:00",
            surplusSimple: "01:15",
            discount: "00:00",
            workingOvertime: "00:00",
            workingNightOvertime: "00:00",
            nonWorkingOvertime: "00:00",
            nonWorkingNightOvertime: "00:00",
            compensatedNightOvertime: "00:00",
          },
        ],
      },
    };
    const res: Partial<Response> = {
      sendStatus: jest.fn(),
      locals: {},
    };
    const next = jest.fn();
    const handler = middleware(schema, "body");
    await handler(req as Request, res as Response, next);
    const sendStatus = res.sendStatus as jest.Mock<any, any>;
    expect(sendStatus.mock.calls).toEqual([]);
    expect(next.mock.calls).toEqual([[]]);
  });
});
