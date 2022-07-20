import { getMockRes } from "@jest-mock/express";
import { Request } from "express";

import middleware, { exists } from "@/validation/middlewares/validation";
import { schemas } from "@/validation/schemas/calculations";

jest.mock("@/persistence/entity", () => ({
  __esModule: true,
  valueExistsInPersistence: jest.fn(() => true),
}));

describe("Validate", () => {
  test("middleware validate that the official with the same id already exists should pass", async () => {
    const { create, paramsCreate } = schemas;

    const req: Partial<Request> = {
      params: {
        year: "2018",
        officialId: "1",
      },
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

    const { res, next } = getMockRes({
      locals: {},
    });

    await middleware(paramsCreate, "params")(req as Request, res, next);
    await middleware(create, "body")(req as Request, res, next);

    const status = res.status as jest.Mock<any, any>;
    if (!res.locals) {
      throw new Error("Must not be undefined");
    }
    expect(res.locals).not.toBeUndefined();
    expect(res.locals.value).toEqual({
      officialId: 1,
      year: 2018,
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
    });
    await exists({
      key: "officialId",
      relatedKey: "id",
      entity: "official",
      property: "params",
      mustExists: true,
    })(req as Request, res, next);
    expect(status.mock.calls).toEqual([]);
    expect(next).toBeCalledTimes(3);
  });
  test("middleware validate that the official with the same id already exists should fail", async () => {
    const { create, paramsCreate } = schemas;

    const req: Partial<Request> = {
      params: {
        year: "2018",
        officialId: "1",
      },
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

    const { res, next } = getMockRes({
      locals: {},
    });

    await middleware(paramsCreate, "params")(req as Request, res, next);
    await middleware(create, "body")(req as Request, res, next);

    const status = res.status as jest.Mock<any, any>;
    if (!res.locals) {
      throw new Error("Must not be undefined");
    }
    expect(res.locals).not.toBeUndefined();
    expect(res.locals.value).toEqual({
      officialId: 1,
      year: 2018,
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
    });
    await exists({
      key: "officialId",
      relatedKey: "id",
      entity: "official",
      property: "params",
      mustExists: false,
    })(req as Request, res, next);
    expect(status.mock.calls).toEqual([[422]]);
    expect(next).toBeCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith({
      message: `The request is not valid. You have provided invalid data.`,
      error: {
        status: 422,
        reason: `The officialId:1 does not exists in official`,
        message: "The register does not exists in the database",
      },
      ok: false,
    });
  });
});
