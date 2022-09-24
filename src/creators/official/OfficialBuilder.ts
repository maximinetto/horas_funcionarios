import Official from "../../entities/Official";
import { OfficialModel } from "./types";

export default interface OfficialBuilder {
  create(official: OfficialModel): Official;
}
