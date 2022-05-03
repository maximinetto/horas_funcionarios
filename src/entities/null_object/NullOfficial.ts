import { Contract, TypeOfOfficials } from "@prisma/client";
import { DateTime } from "luxon";
import Official from "../Official";
import Nullable from "./Nullable";

export default class NullOfficial extends Official implements Nullable {
  public constructor() {
    super(
      0,
      0,
      "",
      "",
      "",
      Contract.PERMANENT,
      TypeOfOfficials.NOT_TEACHER,
      DateTime.now(),
      0,
      []
    );
  }

  public isDefault(): boolean {
    return true;
  }
}
