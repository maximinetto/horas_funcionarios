import {
  EntityProperty,
  Platform,
  Type,
  ValidationError,
} from "@mikro-orm/core";
import { DateTime } from "luxon";

export default class LuxonDateType extends Type<DateTime, string> {
  public convertToDatabaseValue(value: DateTime | string | undefined): string {
    if (value instanceof DateTime) {
      return value.toISODate();
    }

    if (!value || value.toString().match(/^\d{4}-\d{2}-\d{2}$/)) {
      return value as string;
    }

    throw ValidationError.invalidType(LuxonDateType, value, "JS");
  }

  public convertToJSValue(value: DateTime | string | undefined): DateTime {
    if (!value || value instanceof DateTime) {
      return value as DateTime;
    }

    const date = DateTime.fromISO(value);

    if (!date.isValid) {
      throw ValidationError.invalidType(LuxonDateType, value, "database");
    }

    return date;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getColumnType(_prop: EntityProperty, _platform: Platform) {
    return `date`;
  }
}
