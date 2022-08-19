import Database from "persistence/context/Database";
import DatabaseFactory, {
  TypeOfEngine,
} from "persistence/context/index.config";

export let database: Database;

beforeAll(async () => {
  const typeOfEngine = process.env
    .OFFICIALS_SCHEDULES_TYPE_OF_ENGINE as TypeOfEngine;

  database = DatabaseFactory.createDatabase(typeOfEngine);
  await database.init();
});

afterAll(async () => {
  await database.close();
});
