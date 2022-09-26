import Database from "./Database";
import { MikroORMDatabase } from "./mikroorm/MikroORMDatabase";

export type TypeOfEngine = "mikroorm" | "prisma";

export default class DatabaseFactory {
  private static instance: Database;

  public static createDatabase(type: TypeOfEngine): Database {
    const database = DatabaseFactory.databases(type);
    this.instance = database;
    return database;
  }

  public static getInstance() {
    return this.instance;
  }

  private static databases(type) {
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
