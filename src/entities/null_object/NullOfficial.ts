import { Contract, TypeOfOfficials } from "@prisma/client";
import { DateTime } from "luxon";
import Official from "../Official";

export default class NullOfficial extends Official {
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
}
