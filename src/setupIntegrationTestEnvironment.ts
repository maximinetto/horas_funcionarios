import Database from "persistence/context/Database";
import DatabaseFactory from "persistence/context/index.config";

export let unitOfWork: Database;

beforeAll(async () => {
  unitOfWork = DatabaseFactory.createDatabase("mikroorm");
  await unitOfWork.init();
});

afterEach(async () => {
  await unitOfWork.official.clear();
  await unitOfWork.calculationTAS.clear();
  await unitOfWork.calculationTeacher.clear();
  await unitOfWork.hourlyBalanceTAS.clear();
  await unitOfWork.hourlyBalanceTeacher.clear();
  await unitOfWork.actualBalance.clear();
});

afterAll(() => {
  unitOfWork.close();
});
