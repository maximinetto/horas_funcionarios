import { CalculationTAS } from "@/@types/calculations";
import { HourlyBalanceTAS } from "@/@types/hourlyBalance";
import Decimal from "decimal.js";
import { Total } from "./types";

export function calculate(
  calculations: CalculationTAS[],
  lastBalances: HourlyBalanceTAS[]
) {
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

  const total: Total = {
    ...totalCurrentYear,
    totalHours: new Decimal(0),
  };

  lastBalances.forEach(({ hourlyBalanceTAS }) => {
    if (hourlyBalanceTAS) {
      total.simple = new Decimal(hourlyBalanceTAS.simple.toString()).add(
        total.simple
      );
      total.working = new Decimal(hourlyBalanceTAS.working.toString()).add(
        total.working
      );
      total.nonWorking = new Decimal(
        hourlyBalanceTAS.nonWorking.toString()
      ).add(total.nonWorking);
    } else {
      total.simple = new Decimal(0);
      total.working = new Decimal(0);
      total.nonWorking = new Decimal(0);
    }
  });
  total.totalHours = new Decimal(total.working.toString())
    .add(total.nonWorking.toString())
    .add(total.simple.toString())
    .sub(total.discount.toString());

  return { totalCurrentYear, total };
}
