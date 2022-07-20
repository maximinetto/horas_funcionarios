import { Request, Response } from "express";
import Joi from "joi";

import middleware from "@/validation/middlewares/validation";
import { schemas } from "@/validation/schemas/calculations";

describe("Validate", () => {
  test("middleware create calculations is valid", async () => {
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
      status: jest.fn(),
      locals: {},
    };
    const next = jest.fn();
    const handler = middleware(schema, "body");
    await handler(req as Request, res as Response, next);
    const status = res.status as jest.Mock<any, any>;
    expect(status.mock.calls).toEqual([]);
    expect(next.mock.calls).toEqual([[]]);
  });

  test("middleware create calculations is not valid", async () => {
    const schema = schemas.create;

    assertNotValid(
      schema,
      {
        calculations: [],
      },
      [422]
    );
    assertNotValid(schema, {}, [422]);
    assertNotValid(
      schema,
      {
        calculations: [
          {
            year: 2019,
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
      [422]
    );
    assertNotValid(
      schema,
      {
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
      [422]
    );
  });

  test("middleware the calculation params should be valid", async () => {
    const schema = schemas.paramsCreate;
    const req: Partial<Request> = {
      params: {
        year: "2018",
        officialId: "1",
      },
    };
    const res: Partial<Response> = {
      status: jest.fn(),
      locals: {},
    };
    const next = jest.fn();
    const handler = middleware(schema, "params");
    await handler(req as Request, res as Response, next);
    const status = res.status as jest.Mock<any, any>;
    expect(status.mock.calls).toEqual([]);
    expect(next.mock.calls).toEqual([[]]);
    if (!res.locals) {
      throw new Error("Must not be undefined");
    }
    expect(res.locals).not.toBeUndefined();
    expect(res.locals.value).toEqual({
      officialId: 1,
      year: 2018,
    });
  });

  test("middleware combine the above validations", async () => {
    const { paramsCreate, create } = schemas;
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
    const res: Partial<Response> = {
      status: jest.fn(),
      locals: {},
    };
    const next = jest.fn();
    await middleware(paramsCreate, "params")(
      req as Request,
      res as Response,
      next
    );
    await middleware(create, "body")(req as Request, res as Response, next);

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
    expect(next).toBeCalledTimes(2);
  });
});

async function assertNotValid(
  schema: Joi.AnySchema,
  body: any,
  expectStatus?: Array<number>,
  expectNext?: []
) {
  const req = {
    body,
  };
  const res: Partial<Response> = {
    status: jest.fn(),
    locals: {},
  };
  const next = jest.fn();
  const handler = middleware(schema, "body");
  await handler(req as Request, res as Response, next);
  const status = res.status as jest.Mock<any, any>;
  expect(status.mock.calls).toEqual([expectStatus]);
  expect(next.mock.calls).toEqual([expectNext]);
}
