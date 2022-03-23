const TYPES_OF_HOURS = {
  simple: "simple",
  working: "working",
  nonWorking: "nonWorking",
};

export default class Hours {
  constructor() {
    Object.assign(this, ...TYPES_OF_HOURS);
  }

  isFirstTypeOfHour = (value) => {
    return Object.keys(TYPES_OF_HOURS)[0] === value;
  };
  getTypeOfHourByIndex = (index) => TYPES_OF_HOURS[index];
  getTypeOfHourByValue = (value) =>
    Object.values(TYPES_OF_HOURS).find((_value) => value);
  arrayOftypeOfHours = () => Object.values(TYPES_OF_HOURS);
}

export const instance = new Hours();
