import Database from "persistence/context/Database";
import DatabaseFactory from "persistence/context/index.config";

export let unitOfWork: Database;

beforeAll(async () => {
  unitOfWork = DatabaseFactory.createDatabase("mikroorm");
  await unitOfWork.init();
});

afterEach(async () => {
  await unitOfWork.calculationTAS.clear();
  await unitOfWork.calculationTeacher.clear();
  await unitOfWork.official.clear();
  await unitOfWork.hourlyBalance.clear();
  await unitOfWork.actualBalance.clear();
  await unitOfWork.commit();
});

afterAll(() => {
  unitOfWork.close();
});
