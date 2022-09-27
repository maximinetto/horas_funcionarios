import DatabaseFactory, {
  TypeOfEngine,
} from "./persistence/context/index.config";

export const setup = async () => {
  if (!globalThis.database) {
    const typeOfEngine = process.env
      .OFFICIALS_SCHEDULES_TYPE_OF_ENGINE as TypeOfEngine;

    const database = DatabaseFactory.createDatabase(typeOfEngine);
    await database.init(false);
    globalThis.database = database;
  }

  globalThis.define++;
};

setup();
