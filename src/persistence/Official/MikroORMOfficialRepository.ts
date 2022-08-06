import Official from "entities/Official";
import MikroORMRepository from "persistence/MikroORMRepository";

import OfficialRepository from "./OfficialRepository";

export default class MikroORMOfficialRepository
  extends MikroORMRepository<number, Official>
  implements OfficialRepository
{
  constructor() {
    super({ modelName: "Official" });
  }
}
