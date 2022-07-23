import { PartialObject } from "lodash";
import _isNil from "lodash/isNil";
import _omitBy from "lodash/omitBy";

export default function removeKeyIfValueDoesNotDefinite<T extends object>(
  obj: T
): PartialObject<T> {
  return _omitBy<T>(obj, _isNil);
}
