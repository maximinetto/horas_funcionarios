import Official from "entities/Official";
import MikroORMRepository from "persistence/MikroORMRepository";
import { Optional } from "typescript-optional";

import OfficialRepository from "./OfficialRepository";

export default class MikroORMOfficialRepository
  extends MikroORMRepository<number, Official>
  implements OfficialRepository
{
  constructor() {
    super({ modelName: "Official" });
  }

  getLast(): Promise<Optional<Official>> {
    return this._mikroorm.em
      .find(
        Official,
        {},
        {
          orderBy: {
            id: "DESC",
          },
          limit: 1,
        }
      )
      .then((o) => {
        if (o.length > 0) {
          return Optional.of(o[0]);
        }

        return Optional.empty();
      });
  }

  async count(): Promise<number> {
    await this._mikroorm.em.flush();
    return this._mikroorm.em.count(Official);
  }
}
