import Database from "./Database";
import { MikroORMDatabase } from "./mikroorm/MikroORMDatabase";

export type TypeOfEngine = "mikroorm" | "prisma";

export default class DatabaseFactory {
  public static createDatabase(type: TypeOfEngine): Database {
    switch (type) {
      case "mikroorm":
        return new MikroORMDatabase();
      case "prisma":
        throw new Error("Prisma is not implemented yet");
      default:
        throw new Error(`Unknown database type: ${type}`);
    }
  }
}
