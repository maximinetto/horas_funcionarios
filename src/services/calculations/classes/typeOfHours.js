const TYPES_OF_HOURS = {
  simple: "simple",
  working: "working",
  nonWorking: "nonWorking",
};

function getContinuousHour(values, typeOfHour) {
  const index = values.findIndex((value) => value === typeOfHour);

  if (index === -1) {
    throw new Error("The type of hour is invalid");
  }

  return index + 1 === values.length ? values[0] : values[index + 1];
}

export default class Hours {
  isFirstTypeOfHour = (value) => {
    return Object.keys(TYPES_OF_HOURS)[0] === value;
  };
  getTypeOfHourByIndex = (index) => {
    const key = Object.keys(TYPES_OF_HOURS)[index];
    return TYPES_OF_HOURS[key];
  };
  getTypeOfHourByValue = (value) =>
    Object.values(TYPES_OF_HOURS).find((_value) => value);
  arrayOftypeOfHours = () => Object.values(TYPES_OF_HOURS);
  getPreviousTypeOfHour = (typeOfHour) => {
    const reverse = Object.values(TYPES_OF_HOURS).reverse();
    return getContinuousHour(reverse, typeOfHour);
  };
  getNextTypeOfHour = (typeOfHour) => {
    const values = Object.values(TYPES_OF_HOURS);
    return getContinuousHour(values, typeOfHour);
  };

  static simple = TYPES_OF_HOURS.simple;
  static working = TYPES_OF_HOURS.working;
  static nonWorking = TYPES_OF_HOURS.nonWorking;
}

export const instance = new Hours();
