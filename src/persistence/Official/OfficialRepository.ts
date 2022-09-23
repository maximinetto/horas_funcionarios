import { Optional } from "typescript-optional";

import Official from "../../entities/Official";
import Repository from "../Repository";

export default interface OfficialRepository
  extends Repository<number, Official> {
  getLast(): Promise<Optional<Official>>;
  count(): Promise<number>;
}
