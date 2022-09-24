import { Schema } from "joi";
import { describe, expect, test } from "vitest";

import { schemas } from "../../../../validation/schemas/calculations";

describe("Calculation ", () => {
  describe("create schema", () => {
    test("should be valid", () => {
      const schema = schemas.create;
      const object = {
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
      };

      const { value, error } = schema.validate(object, {
        abortEarly: true,
        convert: true,
      });

      expect(error).toBeUndefined();
      expect(value).toEqual(object);
    });
    test("should be not valid", () => {
      const schema = schemas.create;

      assertNotValid(schema, {
        calculations: [],
      });

      assertNotValid(schema, {});

      assertNotValid(schema, {
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
      });
      assertNotValid(schema, {
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
      });
    });
  });
});

function assertNotValid(schema: Schema, object: object) {
  const { error } = schema.validate(object, {
    abortEarly: true,
    convert: true,
  });

  expect(error).not.toBeUndefined();
}
