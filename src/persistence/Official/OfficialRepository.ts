import Official from "entities/Official";
import Repository from "persistence/Repository";
import { Optional } from "typescript-optional";

export default interface OfficialRepository
  extends Repository<number, Official> {
  getLast(): Promise<Optional<Official>>;
  count(): Promise<number>;
}
