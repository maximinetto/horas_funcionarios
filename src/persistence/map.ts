import ActualBalance from "../entities/ActualBalance";
import Calculation from "../entities/Calculation";
import CalculationTAS from "../entities/CalculationTAS";
import CalculationTeacher from "../entities/CalculationTeacher";
import Entity from "../entities/Entity";
import HourlyBalance from "../entities/HourlyBalance";
import HourlyBalanceTAS from "../entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "../entities/HourlyBalanceTeacher";
import Official from "../entities/Official";
import UnexpectedError from "../errors/UnexpectedError";

export type EntityName = string | { new (): Entity };

const map = {
  actualBalance: ActualBalance,
  calculation: Calculation,
  calculationTAS: CalculationTAS,
  calculationTeacher: CalculationTeacher,
  hourlyBalance: HourlyBalance,
  hourlyBalanceTAS: HourlyBalanceTAS,
  hourlyBalanceTeacher: HourlyBalanceTeacher,
  official: Official,
};

const getEntityName = (entity: EntityName): string => {
  return typeof entity === "string" ? entity : entity.name;
};

export const getModelByRef = (EntityRef: EntityName) => {
  const entityName = getEntityName(EntityRef);

  const index = Object.values(map).findIndex((value) => {
    if (typeof value === "string") return entityName === value;

    if (typeof EntityRef === "string") return value.name === entityName;

    return new EntityRef() instanceof value;
  });

  getKey(index);
};

function getKey(index: number) {
  let key: string | undefined = undefined;
  const keys = Object.keys(map);

  for (let i = 0; i < keys.length; i++) {
    if (i === index) {
      key = keys[i];
      break;
    }
  }

  if (!key) {
    throw new UnexpectedError("Invalid Entity");
  }

  return key;
}

export default map;
