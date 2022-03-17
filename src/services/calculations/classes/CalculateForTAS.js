import Calculate from "services/calculations/classes/Calculate";
import { operations } from "persistence/hourlyBalance";

export default class CalculateForTas extends Calculate {
  constructor({ actualDate, calculations, year, officialId }) {
    super({ actualDate, calculations, year, officialId });
  }

  async calculate() {
    await this.validate();

    const { calculations, calculationsFromPersistence } = this;
  }

  getBalances() {
    const lastYear = this.year - 1;
    return operations.getBalance({
      officialId: this.officialId,
      year: lastYear,
    });
  }

  async withId(officialId, calculations) {}

  async withoutId(officialId, calculations) {}

  selectOptions() {
    return {
      include: {
        calculationTAS: true,
      },
    };
  }
}
