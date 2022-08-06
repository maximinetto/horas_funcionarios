import { Type } from "@mikro-orm/core";
import { DateTime } from "luxon";

export default class LuxonDateTimeType extends Type<
  DateTime | undefined,
  string | undefined
> {
  public convertToDatabaseValue(
    value: DateTime | undefined
  ): string | undefined {
    return value && value.toUTC().toSQL({ includeOffset: false });
  }

  public convertToJSValue(value: string | undefined): DateTime | undefined {
    if (!value) return undefined;
    return DateTime.fromSQL(`${value} UTC`);
  }
}
