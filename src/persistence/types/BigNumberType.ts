/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityProperty, Platform, Type } from "@mikro-orm/core";
import Decimal from "decimal.js";

export default class BigNumberType extends Type<
  Decimal | null | undefined,
  BigInt | null | undefined
> {
  convertToDatabaseValue(
    value: Decimal | BigInt | null | undefined,
    platform: Platform,
    fromQuery?: boolean | undefined
  ): BigInt | null | undefined {
    if (!value) return value;

    return BigInt(value.toString());
  }

  convertToJSValue(
    value: Decimal | BigInt | null | undefined,
    platform: Platform
  ): Decimal | null | undefined {
    if (value == null) return value;

    return new Decimal(value.toString());
  }

  getColumnType(_prop: EntityProperty, _platform: Platform) {
    return `bigint`;
  }
}
