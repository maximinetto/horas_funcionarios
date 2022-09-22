import NodeEnvironment from "jest-environment-node";
import Database from "persistence/context/Database";
import DatabaseFactory from "persistence/context/index.config";

// beforeAll(async () => {
//   unitOfWork = DatabaseFactory.createDatabase("mikroorm");
//   await unitOfWork.init();
// });

// afterAll(() => {
//   unitOfWork.close();
// });

export default class DBEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    const unitOfWork = DatabaseFactory.createDatabase("mikroorm");
    await unitOfWork.init();
    this.global.unitOfWork = unitOfWork;
  }

  async teardown() {
    const unitOfWork = this.global.unitOfWork as Database;
    unitOfWork.close();
    await super.teardown();
  }
}
