import { Decimal } from "decimal.js";
import { TYPES_OF_HOURS } from "enums/typeOfHours";
import { instance as Hours } from "services/calculations/classes/typeOfHours";
import { TypeOfHoursByYear } from "types/typeOfHours";

export const hoursOfYearEnricher = (
  {
    workingHours,
    nonWorkingHours,
    simpleHours,
  }: {
    workingHours: { typeOfHour: TYPES_OF_HOURS; value: Decimal };
    nonWorkingHours: { typeOfHour: TYPES_OF_HOURS; value: Decimal };
    simpleHours: { typeOfHour: TYPES_OF_HOURS; value: Decimal };
  },
  year: number
): TypeOfHoursByYear => {
  const hours = [workingHours, nonWorkingHours, simpleHours];

  const sortedHours = Hours.arrayOftypeOfHours().map((typeOfHour) => {
    const hour = hours.find(
      ({ typeOfHour: _typeOfHour }) => typeOfHour === _typeOfHour
    );
    if (!hour) {
      throw new Error("hour is undefined");
    }
    return { typeOfHour, value: hour.value };
  });

  return {
    year,
    hours: sortedHours,
  };
};
