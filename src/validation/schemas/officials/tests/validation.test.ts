import middleware, { exists } from "@/validation/middlewares/validation";
import { schemas } from "@/validation/schemas/officials";
import { getMockRes } from "@jest-mock/express";
import { Contract, TypeOfOfficials } from "@prisma/client";
import { Request, Response } from "express";
import { DateTime } from "luxon";

jest.mock("@/persistence/entity", () => ({
  __esModule: true,
  valueExistsInPersistence: jest.fn(() => true),
}));

describe("Validate", () => {
  test("middleware create official is valid", async () => {
    const schema = schemas.create;

    const req = {
      body: {
        recordNumber: 1,
        firstName: "Maximiliano",
        lastName: "Minetto",
        position: "Informática",
        dateOfEntry: DateTime.fromObject({
          day: 25,
          month: 6,
          year: 2018,
        }).toJSDate(),
        chargeNumber: 1184,
        type: TypeOfOfficials.NOT_TEACHER,
        contract: Contract.TEMPORARY,
      },
    };
    const res: Partial<Response> = {
      status: jest.fn(),
      locals: {},
    };
    const next = jest.fn();
    await middleware(schema, "body")(req as Request, res as Response, next);
    const status = res.status as jest.Mock<any, any>;
    expect(status.mock.calls).toEqual([]);
    expect(next.mock.calls).toEqual([[]]);
  });
  test("middleware should be official id valid", async () => {
    const schema = schemas.id;

    const req: Partial<Request> = {
      params: {
        id: "1",
      },
    };
    const { res, next } = getMockRes();
    await middleware(schema, "params")(req as Request, res as Response, next);

    expect(res.json).not.toBeCalled();
    expect(next).toBeCalled();
    await exists({
      key: "id",
      entity: "official",
      property: "value",
      mustExists: true,
    })(req as Request, res, next);
    expect(res.json).not.toBeCalled();
    expect(next).toBeCalledTimes(2);
  });
  test("middleware update official is valid", async () => {
    const schema = schemas.update;

    const req: Partial<Request> = {
      body: {
        recordNumber: 1,
        firstName: "Maximiliano",
        lastName: "Minetto",
        chargeNumber: 1184,
        contract: Contract.PERMANENT,
      },
    };
    const { res, next } = getMockRes();
    await middleware(schema, "body")(req as Request, res as Response, next);

    expect(res.json).not.toBeCalled();
    expect(next).toBeCalled();
  });
});
