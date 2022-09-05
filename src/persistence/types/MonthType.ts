import {
  EntityProperty,
  Platform,
  Type,
  ValidationError,
} from "@mikro-orm/core";
import { Month } from "@prisma/client";
import { getMonthByNumber, getNumberByMonth } from "utils/mapMonths";

export default class MonthType extends Type<Month, number> {
  public convertToDatabaseValue(value: Month): number {
    return this.convert(value);
  }

  public convertToJSValue(value: Month | number): Month {
    if (typeof value === "number") {
      return getMonthByNumber(value);
    }

    this.convert(value);
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getColumnType(_prop: EntityProperty, _platform: Platform) {
    return `int`;
  }

  private convert(value: Month) {
    try {
      return getNumberByMonth(value);
    } catch (error) {
      throw ValidationError.invalidType(MonthType, value, "JS");
    }
  }
}
