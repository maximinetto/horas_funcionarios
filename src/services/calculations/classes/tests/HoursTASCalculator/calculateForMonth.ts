import Calculations from "collections/Calculations";
import { Decimal } from "decimal.js";
import CalculationTAS from "entities/CalculationTAS";

import { Total } from "./types";

export function calculate(calculations: Calculations<CalculationTAS>) {
  const totalCurrentYear: Omit<Total, "totalHours"> = {
    simple: new Decimal(0),
    working: new Decimal(0),
    nonWorking: new Decimal(0),
    discount: new Decimal(0),
  };
  calculations.forEach((calculation) => {
    totalCurrentYear.simple = totalCurrentYear.simple.add(
      calculation.surplusSimple.toString()
    );
    totalCurrentYear.working = totalCurrentYear.working.add(
      calculation.surplusBusiness.toString()
    );
    totalCurrentYear.nonWorking = totalCurrentYear.nonWorking.add(
      calculation.surplusNonWorking.toString()
    );
    totalCurrentYear.discount = totalCurrentYear.discount.add(
      calculation.discount.toString()
    );
  });

  totalCurrentYear.working = totalCurrentYear.working.mul(1.5);
  totalCurrentYear.nonWorking = totalCurrentYear.nonWorking.mul(2);

  return totalCurrentYear;
}
